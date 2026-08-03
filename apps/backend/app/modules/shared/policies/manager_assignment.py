import uuid

from app.core.exceptions.base import BusinessException
from app.modules.employee.domains.profile.repositories.employee import (
    EmployeeRepository,
)


class ManagerAssignmentPolicy:
    def __init__(self, employee_repo: EmployeeRepository):
        self.employee_repo = employee_repo

    async def check(self, employee_id: uuid.UUID, manager_id: uuid.UUID) -> None:
        if employee_id == manager_id:
            raise BusinessException(
                "SELF_MANAGEMENT_FORBIDDEN",
                "An employee cannot be assigned as their own manager",
            )

        # Verify manager is an active employee
        from app.modules.shared.policies.active_employee import ActiveEmployeePolicy

        active_policy = ActiveEmployeePolicy(self.employee_repo)
        try:
            await active_policy.check(manager_id)
        except BusinessException as e:
            if e.code == "EMPLOYEE_NOT_FOUND":
                raise BusinessException(
                    "MANAGER_NOT_FOUND", f"Assigned manager {manager_id} does not exist"
                )
            elif e.code == "EMPLOYEE_INACTIVE":
                raise BusinessException(
                    "MANAGER_INACTIVE", f"Assigned manager {manager_id} is inactive"
                )
            raise

        # Validate that the manager does not report to the employee (no circular manager loop!)
        from app.modules.platform.domains.context_vars import bypass_tenant_context

        token = bypass_tenant_context.set(True)
        try:
            curr_manager = await self.employee_repo.get_by_id(manager_id)
            visited = {employee_id, manager_id}
            while curr_manager:
                next_manager_id = getattr(curr_manager, "manager_id", None)
                if not next_manager_id:
                    break
                if next_manager_id in visited:
                    raise BusinessException(
                        "CIRCULAR_MANAGER_LOOP", "Circular reporting hierarchy detected"
                    )
                visited.add(next_manager_id)
                curr_manager = await self.employee_repo.get_by_id(next_manager_id)
        finally:
            bypass_tenant_context.reset(token)
