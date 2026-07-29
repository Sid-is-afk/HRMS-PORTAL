import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.employee.domains.emergency.models.emergency import EmergencyContact


class EmergencyRepository(BaseRepository[EmergencyContact]):
    def __init__(self, session: AsyncSession):
        super().__init__(EmergencyContact, session)

    async def get_by_employee_id(
        self, employee_id: uuid.UUID
    ) -> list[EmergencyContact]:
        stmt = select(EmergencyContact).where(
            EmergencyContact.employee_id == employee_id
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
