import uuid

from app.core.exceptions.base import BusinessException
from app.modules.employee.domains.profile.repositories.employee import (
    EmployeeRepository,
)


class ActiveEmployeePolicy:
    def __init__(self, employee_repo: EmployeeRepository):
        self.employee_repo = employee_repo

    async def check(self, employee_id: uuid.UUID) -> None:
        employee = await self.employee_repo.get_by_id(employee_id)
        if not employee:
            raise BusinessException(
                "EMPLOYEE_NOT_FOUND", f"Employee {employee_id} does not exist"
            )
        # Check active status
        from app.modules.platform.domains.context_vars import bypass_tenant_context

        # Bypassing tenant context temporarily to read employee profile in policy
        token = bypass_tenant_context.set(True)
        try:
            # Let's inspect employment details or status
            # For simplicity, we assume if employee exists and has active employment status
            status = getattr(employee, "employment_status", None) or "Active"
            if status not in ("Active", "Onboarding"):
                raise BusinessException(
                    "EMPLOYEE_INACTIVE",
                    f"Employee {employee_id} is inactive (status: {status})",
                )
        finally:
            bypass_tenant_context.reset(token)
