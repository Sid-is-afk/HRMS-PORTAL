import uuid

from app.modules.employee.domains.bank.models.bank import BankInformation
from app.modules.employee.domains.bank.repositories.bank import BankRepository


class BankService:
    def __init__(self, repository: BankRepository):
        self.repository = repository

    async def get_by_employee_id(self, employee_id: uuid.UUID) -> list[BankInformation]:
        return await self.repository.get_by_employee_id(employee_id)
