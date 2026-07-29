import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.employee.domains.contacts.models.contact import ContactInformation


class ContactRepository(BaseRepository[ContactInformation]):
    def __init__(self, session: AsyncSession):
        super().__init__(ContactInformation, session)

    async def get_by_employee_id(
        self, employee_id: uuid.UUID
    ) -> ContactInformation | None:
        stmt = select(ContactInformation).where(
            ContactInformation.employee_id == employee_id
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_email(self, email: str) -> ContactInformation | None:
        stmt = select(ContactInformation).where(
            ContactInformation.primary_email == email
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()
