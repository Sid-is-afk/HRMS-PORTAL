import uuid
from datetime import UTC, datetime

from app.core.exceptions.base import (
    BusinessException,
    NotFoundException,
)
from app.events.publishers.employee import publish_employee_event
from app.modules.employee.domains.bank.models.bank import BankInformation
from app.modules.employee.domains.bank.repositories.bank import BankRepository
from app.modules.employee.domains.contacts.models.contact import ContactInformation
from app.modules.employee.domains.contacts.repositories.contact import ContactRepository
from app.modules.employee.domains.documents.models.document import EmployeeDocument
from app.modules.employee.domains.documents.repositories.document import (
    DocumentRepository,
)
from app.modules.employee.domains.emergency.models.emergency import EmergencyContact
from app.modules.employee.domains.emergency.repositories.emergency import (
    EmergencyRepository,
)
from app.modules.employee.domains.employment.models.employment import Employment
from app.modules.employee.domains.employment.repositories.employment import (
    EmploymentRepository,
)
from app.modules.employee.domains.profile.events.events import (
    DepartmentChanged,
    DocumentAdded,
    DocumentRemoved,
    EmployeeActivated,
    EmployeeCreated,
    EmployeeDeactivated,
    EmployeeDeleted,
    EmployeeUpdated,
    EmploymentChanged,
    ManagerChanged,
)
from app.modules.employee.domains.profile.models.employee import Employee
from app.modules.employee.domains.profile.repositories.employee import (
    EmployeeRepository,
)
from app.modules.employee.domains.profile.schemas.schemas import (
    EmployeeCreateRequest,
    EmployeeUpdateRequest,
)

VALID_DEPARTMENTS = [
    "Engineering",
    "HR",
    "Sales",
    "Marketing",
    "Finance",
    "Operations",
    "Product",
]


class EmployeeService:
    def __init__(
        self,
        employee_repo: EmployeeRepository,
        contact_repo: ContactRepository,
        employment_repo: EmploymentRepository,
        emergency_repo: EmergencyRepository,
        bank_repo: BankRepository,
        document_repo: DocumentRepository,
    ):
        self.employee_repo = employee_repo
        self.contact_repo = contact_repo
        self.employment_repo = employment_repo
        self.emergency_repo = emergency_repo
        self.bank_repo = bank_repo
        self.document_repo = document_repo

    def _validate_department(self, dept: str | None) -> None:
        if dept and dept not in VALID_DEPARTMENTS:
            raise BusinessException(
                "INVALID_DEPARTMENT",
                f"Department '{dept}' is invalid. Allowed: {VALID_DEPARTMENTS}",
            )

    async def _validate_manager(
        self,
        manager_id: uuid.UUID | None,
        company_id: uuid.UUID,
        employee_id: uuid.UUID | None = None,
    ) -> None:
        if manager_id:
            from app.modules.shared.policies.manager_assignment import (
                ManagerAssignmentPolicy,
            )

            policy = ManagerAssignmentPolicy(self.employee_repo)
            emp_id = employee_id or uuid.uuid4()
            await policy.check(emp_id, manager_id)

    async def create_employee(
        self,
        company_id: uuid.UUID,
        payload: EmployeeCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Employee:
        # 1. Unique code check
        existing_code = await self.employee_repo.get_by_code(
            company_id, payload.employee_code
        )
        if existing_code:
            raise BusinessException(
                "DUPLICATE_EMPLOYEE_CODE",
                "Employee code already exists in this company",
            )

        # 2. Email uniqueness check
        if payload.contact_info:
            existing_email = await self.contact_repo.get_by_email(
                payload.contact_info.primary_email
            )
            if existing_email:
                raise BusinessException(
                    "DUPLICATE_EMAIL", "Primary email already in use"
                )

        # 3. Department validation
        self._validate_department(payload.department)

        # 4. Manager validation
        await self._validate_manager(payload.manager_id, company_id)

        # 5. Create core Employee record
        employee = Employee(
            company_id=company_id,
            identity_id=payload.identity_id,
            employee_code=payload.employee_code,
            first_name=payload.first_name,
            middle_name=payload.middle_name,
            last_name=payload.last_name,
            preferred_name=payload.preferred_name,
            gender=payload.gender,
            date_of_birth=payload.date_of_birth,
            nationality=payload.nationality,
            profile_photo=payload.profile_photo,
            employment_status=payload.employment_status,
            employment_type=payload.employment_type,
            department=payload.department,
            designation=payload.designation,
            manager_id=payload.manager_id,
            joining_date=payload.joining_date,
            confirmation_date=payload.confirmation_date,
            work_location=payload.work_location,
            organization_unit=payload.organization_unit,
            created_by=actor_id,
            updated_by=actor_id,
            profile_info={"bio": "", "languages": [], "skills": []},
        )
        employee = await self.employee_repo.create(employee)

        # 6. Create child tables
        if payload.contact_info:
            contact = ContactInformation(
                employee_id=employee.id,
                primary_email=payload.contact_info.primary_email,
                secondary_email=payload.contact_info.secondary_email,
                primary_phone=payload.contact_info.primary_phone,
                secondary_phone=payload.contact_info.secondary_phone,
                current_address=payload.contact_info.current_address,
                permanent_address=payload.contact_info.permanent_address,
            )
            await self.contact_repo.create(contact)

        # Create employment record
        emp_status = payload.employment_status
        emp_type = payload.employment_type
        joining = payload.joining_date
        confirm = payload.confirmation_date
        if payload.employment:
            emp_status = payload.employment.employment_status
            emp_type = payload.employment.employment_type
            joining = payload.employment.joining_date
            confirm = payload.employment.confirmation_date

        employment = Employment(
            employee_id=employee.id,
            employment_status=emp_status,
            employment_type=emp_type,
            reporting_manager_id=payload.manager_id,
            department=payload.department,
            designation=payload.designation,
            business_unit=(
                payload.employment.business_unit if payload.employment else None
            ),
            organization_unit=payload.organization_unit,
            joining_date=joining,
            confirmation_date=confirm,
            exit_date=payload.employment.exit_date if payload.employment else None,
        )
        await self.employment_repo.create(employment)

        if payload.emergency_contacts:
            for ec_payload in payload.emergency_contacts:
                ec = EmergencyContact(
                    employee_id=employee.id,
                    name=ec_payload.name,
                    relationship=ec_payload.relationship,
                    phone=ec_payload.phone,
                    email=ec_payload.email,
                    priority=ec_payload.priority,
                )
                await self.emergency_repo.create(ec)

        if payload.bank_info:
            for bank_payload in payload.bank_info:
                bank = BankInformation(
                    employee_id=employee.id,
                    bank_name=bank_payload.bank_name,
                    account_holder=bank_payload.account_holder,
                    account_number=bank_payload.account_number,
                    ifsc=bank_payload.ifsc,
                    branch=bank_payload.branch,
                    primary_account=bank_payload.primary_account,
                )
                await self.bank_repo.create(bank)

        if payload.documents:
            for doc_payload in payload.documents:
                doc = EmployeeDocument(
                    employee_id=employee.id,
                    document_type=doc_payload.document_type,
                    name=doc_payload.name,
                    storage_reference=doc_payload.storage_reference,
                    verification_status=doc_payload.verification_status,
                )
                await self.document_repo.create(doc)
                await publish_employee_event(
                    DocumentAdded(
                        employee_id=employee.id,
                        company_id=company_id,
                        actor_id=actor_id,
                        payload={"document_type": doc.document_type, "name": doc.name},
                    )
                )

        # 7. Publish domain event
        await publish_employee_event(
            EmployeeCreated(
                employee_id=employee.id,
                company_id=company_id,
                actor_id=actor_id,
                payload={
                    "employee_code": employee.employee_code,
                    "first_name": employee.first_name,
                    "last_name": employee.last_name,
                },
            )
        )

        return await self.employee_repo.get_by_id_with_relations(employee.id)  # type: ignore[return-value]

    async def update_employee(
        self,
        company_id: uuid.UUID,
        employee_id: uuid.UUID,
        payload: EmployeeUpdateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Employee:
        employee = await self.employee_repo.get_by_id_with_relations(employee_id)
        if (
            not employee
            or employee.company_id != company_id
            or employee.deleted_at is not None
        ):
            raise NotFoundException("EMPLOYEE_NOT_FOUND", "Employee not found")

        # 1. Department change check
        if payload.department is not None and payload.department != employee.department:
            self._validate_department(payload.department)
            old_dept = employee.department
            employee.department = payload.department
            await publish_employee_event(
                DepartmentChanged(
                    employee_id=employee.id,
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={
                        "old_department": old_dept,
                        "new_department": payload.department,
                    },
                )
            )

        # 2. Manager change check
        if payload.manager_id is not None and payload.manager_id != employee.manager_id:
            await self._validate_manager(
                payload.manager_id, company_id, employee_id=employee.id
            )
            old_mgr = employee.manager_id
            employee.manager_id = payload.manager_id
            await publish_employee_event(
                ManagerChanged(
                    employee_id=employee.id,
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={
                        "old_manager_id": str(old_mgr) if old_mgr else None,
                        "new_manager_id": str(payload.manager_id),
                    },
                )
            )

        # 3. Simple fields update
        for field in [
            "first_name",
            "middle_name",
            "last_name",
            "preferred_name",
            "gender",
            "date_of_birth",
            "nationality",
            "profile_photo",
            "employment_status",
            "employment_type",
            "joining_date",
            "confirmation_date",
            "work_location",
            "organization_unit",
        ]:
            val = getattr(payload, field, None)
            if val is not None:
                setattr(employee, field, val)

        employee.updated_by = actor_id
        employee.updated_at = datetime.now(UTC).replace(tzinfo=None)

        # 4. Contact Information Update
        if payload.contact_info and employee.contact_info:
            contact = employee.contact_info
            if (
                payload.contact_info.primary_email is not None
                and payload.contact_info.primary_email != contact.primary_email
            ):
                existing_email = await self.contact_repo.get_by_email(
                    payload.contact_info.primary_email
                )
                if existing_email and existing_email.employee_id != employee.id:
                    raise BusinessException(
                        "DUPLICATE_EMAIL", "Email already in use by another employee"
                    )
                contact.primary_email = payload.contact_info.primary_email

            for field in [
                "secondary_email",
                "primary_phone",
                "secondary_phone",
                "current_address",
                "permanent_address",
            ]:
                val = getattr(payload.contact_info, field, None)
                if val is not None:
                    setattr(contact, field, val)
            await self.contact_repo.create(contact)

        # 5. Employment details update
        if payload.employment and employee.employment:
            employment = employee.employment
            employment.employment_status = (
                payload.employment.employment_status or employee.employment_status
            )
            employment.employment_type = (
                payload.employment.employment_type or employee.employment_type
            )
            employment.reporting_manager_id = employee.manager_id
            employment.department = employee.department
            employment.designation = employee.designation
            employment.organization_unit = employee.organization_unit

            if payload.employment.business_unit is not None:
                employment.business_unit = payload.employment.business_unit
            if payload.employment.joining_date is not None:
                employment.joining_date = payload.employment.joining_date
            if payload.employment.confirmation_date is not None:
                employment.confirmation_date = payload.employment.confirmation_date
            if payload.employment.exit_date is not None:
                employment.exit_date = payload.employment.exit_date

            await self.employment_repo.create(employment)
            await publish_employee_event(
                EmploymentChanged(
                    employee_id=employee.id,
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={
                        "employment_status": employment.employment_status,
                        "employment_type": employment.employment_type,
                    },
                )
            )

        # 6. Child tables overwrite-sync (simplification for aggregate consistency)
        if payload.emergency_contacts is not None:
            # Drop old ones
            for old_ec in employee.emergency_contacts:
                await self.emergency_repo.delete_by_id(old_ec.id)
            # Add new ones
            for ec_payload in payload.emergency_contacts:
                ec = EmergencyContact(
                    employee_id=employee.id,
                    name=ec_payload.name,
                    relationship=ec_payload.relationship,
                    phone=ec_payload.phone,
                    email=ec_payload.email,
                    priority=ec_payload.priority,
                )
                await self.emergency_repo.create(ec)

        if payload.bank_info is not None:
            for old_bank in employee.bank_info:
                await self.bank_repo.delete_by_id(old_bank.id)
            for bank_payload in payload.bank_info:
                bank = BankInformation(
                    employee_id=employee.id,
                    bank_name=bank_payload.bank_name,
                    account_holder=bank_payload.account_holder,
                    account_number=bank_payload.account_number,
                    ifsc=bank_payload.ifsc,
                    branch=bank_payload.branch,
                    primary_account=bank_payload.primary_account,
                )
                await self.bank_repo.create(bank)

        if payload.documents is not None:
            # We track added/removed documents to publish target events
            old_docs = {d.name: d for d in employee.documents}
            new_doc_names = {d.name for d in payload.documents}

            # Remove documents no longer present
            for old_doc_name, old_doc in old_docs.items():
                if old_doc_name not in new_doc_names:
                    await self.document_repo.delete_by_id(old_doc.id)
                    await publish_employee_event(
                        DocumentRemoved(
                            employee_id=employee.id,
                            company_id=company_id,
                            actor_id=actor_id,
                            payload={"name": old_doc_name},
                        )
                    )

            # Add documents
            for doc_payload in payload.documents:
                if doc_payload.name not in old_docs:
                    doc = EmployeeDocument(
                        employee_id=employee.id,
                        document_type=doc_payload.document_type,
                        name=doc_payload.name,
                        storage_reference=doc_payload.storage_reference,
                        verification_status=doc_payload.verification_status,
                    )
                    await self.document_repo.create(doc)
                    await publish_employee_event(
                        DocumentAdded(
                            employee_id=employee.id,
                            company_id=company_id,
                            actor_id=actor_id,
                            payload={
                                "document_type": doc.document_type,
                                "name": doc.name,
                            },
                        )
                    )

        await self.employee_repo.create(employee)

        # 7. Publish update event
        await publish_employee_event(
            EmployeeUpdated(
                employee_id=employee.id,
                company_id=company_id,
                actor_id=actor_id,
                payload={"employee_code": employee.employee_code},
            )
        )

        return await self.employee_repo.get_by_id_with_relations(employee.id)  # type: ignore[return-value]

    async def patch_status(
        self,
        company_id: uuid.UUID,
        employee_id: uuid.UUID,
        status: str,
        actor_id: uuid.UUID | None = None,
    ) -> Employee:
        employee = await self.employee_repo.get_by_id_with_relations(employee_id)
        if (
            not employee
            or employee.company_id != company_id
            or employee.deleted_at is not None
        ):
            raise NotFoundException("EMPLOYEE_NOT_FOUND", "Employee not found")

        old_status = employee.employment_status
        employee.employment_status = status
        employee.updated_at = datetime.now(UTC).replace(tzinfo=None)
        employee.updated_by = actor_id

        # Update nested employment record
        if employee.employment:
            employee.employment.employment_status = status
            await self.employment_repo.create(employee.employment)

        await self.employee_repo.create(employee)

        # Event dispatches
        if status.upper() == "ACTIVE" and old_status.upper() != "ACTIVE":
            await publish_employee_event(
                EmployeeActivated(
                    employee_id=employee.id, company_id=company_id, actor_id=actor_id
                )
            )
        elif status.upper() == "INACTIVE" and old_status.upper() != "INACTIVE":
            await publish_employee_event(
                EmployeeDeactivated(
                    employee_id=employee.id, company_id=company_id, actor_id=actor_id
                )
            )

        return await self.employee_repo.get_by_id_with_relations(employee.id)  # type: ignore[return-value]

    async def delete_employee(
        self,
        company_id: uuid.UUID,
        employee_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> None:
        employee = await self.employee_repo.get_by_id(employee_id)
        if (
            not employee
            or employee.company_id != company_id
            or employee.deleted_at is not None
        ):
            raise NotFoundException("EMPLOYEE_NOT_FOUND", "Employee not found")

        # Soft delete
        employee.deleted_at = datetime.now(UTC).replace(tzinfo=None)
        employee.employment_status = "INACTIVE"
        employee.updated_by = actor_id
        await self.employee_repo.create(employee)

        await publish_employee_event(
            EmployeeDeleted(
                employee_id=employee.id, company_id=company_id, actor_id=actor_id
            )
        )
