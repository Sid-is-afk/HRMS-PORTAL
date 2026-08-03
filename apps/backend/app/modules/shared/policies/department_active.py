import uuid

from app.core.exceptions.base import BusinessException
from app.modules.admin.domains.departments.repositories.department import (
    DepartmentRepository,
)


class DepartmentActivePolicy:
    def __init__(self, department_repo: DepartmentRepository):
        self.department_repo = department_repo

    async def check(self, department_id: uuid.UUID) -> None:
        dept = await self.department_repo.get_by_id(department_id)
        if not dept:
            raise BusinessException(
                "DEPARTMENT_NOT_FOUND", f"Department {department_id} does not exist"
            )
        # Department status verification
        status = getattr(dept, "status", "Active")
        if status != "Active":
            raise BusinessException(
                "DEPARTMENT_INACTIVE", f"Department {department_id} is inactive"
            )

        # Verify parent organization/company is also active
        # Let's import OrganizationRepository to inspect organization status if company_id is available
        company_id = getattr(dept, "company_id", None)
        if company_id:
            from app.modules.admin.domains.organization.repositories.organization import (
                OrganizationRepository,
            )

            org_repo = OrganizationRepository(self.department_repo.session)
            org = await org_repo.get_by_id(company_id)
            if org:
                org_status = getattr(org, "status", "Active")
                if org_status != "Active":
                    raise BusinessException(
                        "ORGANIZATION_INACTIVE",
                        f"Organization for department {department_id} is inactive",
                    )
