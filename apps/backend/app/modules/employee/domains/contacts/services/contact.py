import uuid

from app.modules.employee.domains.contacts.models.contact import ContactInformation
from app.modules.employee.domains.contacts.repositories.contact import ContactRepository


class ContactService:
    def __init__(self, repository: ContactRepository):
        self.repository = repository

    async def get_by_employee_id(
        self, employee_id: uuid.UUID
    ) -> ContactInformation | None:
        return await self.repository.get_by_employee_id(employee_id)
