import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.employee.domains.documents.models.document import EmployeeDocument


class DocumentRepository(BaseRepository[EmployeeDocument]):
    def __init__(self, session: AsyncSession):
        super().__init__(EmployeeDocument, session)

    async def get_by_employee_id(
        self, employee_id: uuid.UUID
    ) -> list[EmployeeDocument]:
        stmt = select(EmployeeDocument).where(
            EmployeeDocument.employee_id == employee_id
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
