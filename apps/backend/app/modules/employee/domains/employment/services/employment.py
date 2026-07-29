import uuid

from app.modules.employee.domains.employment.models.employment import Employment
from app.modules.employee.domains.employment.repositories.employment import (
    EmploymentRepository,
)


class EmploymentService:
    def __init__(self, repository: EmploymentRepository):
        self.repository = repository

    async def get_by_employee_id(self, employee_id: uuid.UUID) -> Employment | None:
        return await self.repository.get_by_employee_id(employee_id)
