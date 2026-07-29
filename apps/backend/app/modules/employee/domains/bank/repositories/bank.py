import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.employee.domains.bank.models.bank import BankInformation


class BankRepository(BaseRepository[BankInformation]):
    def __init__(self, session: AsyncSession):
        super().__init__(BankInformation, session)

    async def get_by_employee_id(self, employee_id: uuid.UUID) -> list[BankInformation]:
        stmt = select(BankInformation).where(BankInformation.employee_id == employee_id)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
