import uuid

from app.modules.employee.domains.emergency.models.emergency import EmergencyContact
from app.modules.employee.domains.emergency.repositories.emergency import (
    EmergencyRepository,
)


class EmergencyService:
    def __init__(self, repository: EmergencyRepository):
        self.repository = repository

    async def get_by_employee_id(
        self, employee_id: uuid.UUID
    ) -> list[EmergencyContact]:
        return await self.repository.get_by_employee_id(employee_id)
