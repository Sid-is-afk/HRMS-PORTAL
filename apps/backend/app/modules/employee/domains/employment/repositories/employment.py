import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.employee.domains.employment.models.employment import Employment


class EmploymentRepository(BaseRepository[Employment]):
    def __init__(self, session: AsyncSession):
        super().__init__(Employment, session)

    async def get_by_employee_id(self, employee_id: uuid.UUID) -> Employment | None:
        stmt = select(Employment).where(Employment.employee_id == employee_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()
