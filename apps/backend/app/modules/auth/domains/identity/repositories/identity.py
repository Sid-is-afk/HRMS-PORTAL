from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.auth.domains.identity.models.identity import Identity


class IdentityRepository(BaseRepository[Identity]):
    def __init__(self, session: AsyncSession):
        super().__init__(Identity, session)

    async def get_by_email(self, email: str) -> Identity | None:
        stmt = select(Identity).where(Identity.email == email)
        result = await self.session.execute(stmt)
        return result.scalars().first()
