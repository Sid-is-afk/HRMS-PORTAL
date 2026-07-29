from typing import Any
import uuid
from datetime import UTC, date, datetime, timedelta

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.hashing import get_password_hash
from app.core.security.jwt import create_access_token
from app.modules.auth.domains.identity.models.identity import Identity
from app.modules.auth.domains.permissions.models.permission import Permission
from app.modules.auth.domains.roles.models.role import (
    Role,
    role_permissions,
    user_roles,
)
from app.modules.auth.domains.sessions.models.session import Session
from app.modules.auth.domains.users.models.user import User
from app.modules.employee.domains.bank.repositories.bank import BankRepository
from app.modules.employee.domains.contacts.repositories.contact import ContactRepository
from app.modules.employee.domains.documents.repositories.document import (
    DocumentRepository,
)
from app.modules.employee.domains.emergency.repositories.emergency import (
    EmergencyRepository,
)
from app.modules.employee.domains.employment.repositories.employment import (
    EmploymentRepository,
)
from app.modules.employee.domains.profile.models.employee import Employee
from app.modules.employee.domains.profile.repositories.employee import (
    EmployeeRepository,
)
from app.modules.employee.domains.profile.schemas.schemas import (
    ContactInformationCreate,
    EmployeeCreateRequest,
)
from app.modules.employee.domains.profile.services.employee import EmployeeService


@pytest.fixture
async def auth_setup(db_session: AsyncSession) -> dict[str, Any]:
    company_id = uuid.uuid4()

    # 1. Create permissions
    perms = {}
    for perm_name in [
        "employee:create",
        "employee:read",
        "employee:update",
        "employee:delete",
    ]:
        perm = Permission(name=perm_name, description=f"Permission for {perm_name}")
        db_session.add(perm)
        perms[perm_name] = perm
    await db_session.flush()

    # 2. Create role
    role = Role(name="HR Manager", description="HR Management Role")
    db_session.add(role)
    await db_session.flush()

    # 3. Associate permissions to role
    for perm in perms.values():
        await db_session.execute(
            role_permissions.insert().values(role_id=role.id, permission_id=perm.id)
        )

    # 4. Create identity
    identity = Identity(
        email="hr@enterprise.com",
        password_hash=get_password_hash("password123"),
        account_status="Active",
        email_verified=True,
    )
    db_session.add(identity)
    await db_session.flush()

    # 5. Create user
    user = User(
        identity_id=identity.id,
        company_id=company_id,
        display_name="HR Administrator",
    )
    db_session.add(user)
    await db_session.flush()

    # 6. Associate user to role
    await db_session.execute(
        user_roles.insert().values(user_id=user.id, role_id=role.id)
    )

    # 7. Create session
    session = Session(
        identity_id=identity.id,
        is_active=True,
        expires_at=datetime.now(UTC).replace(tzinfo=None) + timedelta(days=1),
    )
    db_session.add(session)
    await db_session.flush()

    await db_session.commit()
    await db_session.refresh(identity)
    await db_session.refresh(user)

    # Generate token
    token = create_access_token(
        {
            "sub": str(identity.id),
            "sid": str(session.id),
            "tver": identity.token_version,
        }
    )
    headers = {"Authorization": f"Bearer {token}"}

    return {
        "company_id": company_id,
        "identity_id": identity.id,
        "user_id": user.id,
        "headers": headers,
    }


@pytest.mark.asyncio
async def test_employee_repository_crud(
    db_session: AsyncSession, auth_setup: dict[str, Any]
) -> None:
    company_id = auth_setup["company_id"]
    repo = EmployeeRepository(db_session)

    # Create
    emp = Employee(
        company_id=company_id,
        employee_code="EMP-100",
        first_name="Jane",
        last_name="Smith",
        joining_date=date(2026, 1, 15),
    )
    created = await repo.create(emp)
    assert created.id is not None
    assert created.employee_code == "EMP-100"

    # Get by Code
    fetched = await repo.get_by_code(company_id, "EMP-100")
    assert fetched is not None
    assert fetched.first_name == "Jane"

    # Paginated lookup
    employees, total = await repo.get_paginated(company_id, page=1, size=10)
    assert total == 1
    assert len(employees) == 1


@pytest.mark.asyncio
async def test_employee_service_validations(
    db_session: AsyncSession, auth_setup: dict[str, Any]
) -> None:
    company_id = auth_setup["company_id"]
    actor_id = auth_setup["user_id"]

    employee_service = EmployeeService(
        employee_repo=EmployeeRepository(db_session),
        contact_repo=ContactRepository(db_session),
        employment_repo=EmploymentRepository(db_session),
        emergency_repo=EmergencyRepository(db_session),
        bank_repo=BankRepository(db_session),
        document_repo=DocumentRepository(db_session),
    )

    # Create base valid request payload
    payload = EmployeeCreateRequest(
        employee_code="EMP-001",
        first_name="John",
        last_name="Doe",
        joining_date=date(2026, 2, 1),
        department="Engineering",
        contact_info=ContactInformationCreate(
            primary_email="john.doe@company.com",
            primary_phone="+1234567890",
        ),
    )

    # Create successful
    emp = await employee_service.create_employee(company_id, payload, actor_id)
    assert emp.employee_code == "EMP-001"
    assert emp.contact_info.primary_email == "john.doe@company.com"

    # Test Validation: Duplicate Employee Code
    from app.core.exceptions.base import BusinessException

    with pytest.raises(BusinessException) as exc_info:
        await employee_service.create_employee(company_id, payload, actor_id)
    assert exc_info.value.code == "DUPLICATE_EMPLOYEE_CODE"

    # Test Validation: Duplicate Email
    payload_dup_email = EmployeeCreateRequest(
        employee_code="EMP-002",
        first_name="Jane",
        last_name="Doe",
        joining_date=date(2026, 2, 1),
        department="Engineering",
        contact_info=ContactInformationCreate(
            primary_email="john.doe@company.com",
            primary_phone="+1234567891",
        ),
    )
    with pytest.raises(BusinessException) as exc_info:
        await employee_service.create_employee(company_id, payload_dup_email, actor_id)
    assert exc_info.value.code == "DUPLICATE_EMAIL"

    # Test Validation: Invalid Department
    payload_inv_dept = EmployeeCreateRequest(
        employee_code="EMP-003",
        first_name="Jane",
        last_name="Doe",
        joining_date=date(2026, 2, 1),
        department="InvalidDepartment",
    )
    with pytest.raises(BusinessException) as exc_info:
        await employee_service.create_employee(company_id, payload_inv_dept, actor_id)
    assert exc_info.value.code == "INVALID_DEPARTMENT"


@pytest.mark.asyncio
async def test_employee_api_crud_flow(
    client: AsyncClient, auth_setup: dict[str, Any]
) -> None:
    headers = auth_setup["headers"]

    # 1. POST Create employee
    payload = {
        "employee_code": "EMP-999",
        "first_name": "Robert",
        "last_name": "Martin",
        "joining_date": "2026-03-01",
        "department": "Engineering",
        "contact_info": {
            "primary_email": "uncle.bob@clean-code.com",
            "primary_phone": "1234567890",
        },
        "employment": {
            "employment_status": "ACTIVE",
            "employment_type": "FULL_TIME",
            "joining_date": "2026-03-01",
        },
        "emergency_contacts": [
            {"name": "Mary Martin", "relationship": "Spouse", "phone": "9876543210"}
        ],
        "bank_info": [
            {
                "bank_name": "State Bank",
                "account_holder": "Robert Martin",
                "account_number": "123456789",
                "ifsc": "SBIN0001234",
                "branch": "Chicago",
                "primary_account": True,
            }
        ],
        "documents": [
            {
                "document_type": "Resume",
                "name": "bob_resume.pdf",
                "storage_reference": "/storage/resume/bob_resume.pdf",
            }
        ],
    }

    res_post = await client.post("/api/v1/employees", json=payload, headers=headers)
    assert res_post.status_code == 200
    res_data = res_post.json()["data"]
    emp_id = res_data["id"]
    assert res_data["employee_code"] == "EMP-999"
    assert res_data["contact_info"]["primary_email"] == "uncle.bob@clean-code.com"
    assert len(res_data["bank_info"]) == 1
    assert res_data["bank_info"][0]["ifsc"] == "SBIN0001234"

    # 2. GET List employees
    res_list = await client.get("/api/v1/employees", headers=headers)
    assert res_list.status_code == 200
    assert len(res_list.json()["data"]) == 1

    # 3. GET Single employee
    res_get = await client.get(f"/api/v1/employees/{emp_id}", headers=headers)
    assert res_get.status_code == 200
    assert res_get.json()["data"]["first_name"] == "Robert"

    # 4. PUT Update employee
    update_payload = {
        "first_name": "Bob",
        "department": "Product",
        "contact_info": {
            "primary_email": "bob.martin@clean-code.com",
            "primary_phone": "1234567890",
        },
    }
    res_put = await client.put(
        f"/api/v1/employees/{emp_id}", json=update_payload, headers=headers
    )
    assert res_put.status_code == 200
    assert res_put.json()["data"]["first_name"] == "Bob"
    assert res_put.json()["data"]["department"] == "Product"

    # 5. GET/PUT Profile Details
    res_prof_get = await client.get(
        f"/api/v1/employees/{emp_id}/profile", headers=headers
    )
    assert res_prof_get.status_code == 200
    assert res_prof_get.json()["data"]["bio"] == ""

    prof_update = {
        "bio": "Software design patterns expert",
        "languages": ["English", "Java", "Python"],
        "skills": ["TDD", "Refactoring", "Clean Architecture"],
    }
    res_prof_put = await client.put(
        f"/api/v1/employees/{emp_id}/profile", json=prof_update, headers=headers
    )
    assert res_prof_put.status_code == 200
    assert res_prof_put.json()["data"]["bio"] == "Software design patterns expert"
    assert "TDD" in res_prof_put.json()["data"]["skills"]

    # 6. PATCH status
    res_status = await client.patch(
        f"/api/v1/employees/{emp_id}/status?status=INACTIVE", headers=headers
    )
    assert res_status.status_code == 200
    assert res_status.json()["data"]["employment_status"] == "INACTIVE"

    # 7. DELETE soft delete
    res_del = await client.delete(f"/api/v1/employees/{emp_id}", headers=headers)
    assert res_del.status_code == 204

    # Verify not found after soft delete
    res_get_deleted = await client.get(f"/api/v1/employees/{emp_id}", headers=headers)
    assert res_get_deleted.status_code == 404
