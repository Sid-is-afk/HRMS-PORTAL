import uuid

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.auth.domains.sessions.models.session import Session


class SessionRepository(BaseRepository[Session]):
    def __init__(self, session: AsyncSession):
        super().__init__(Session, session)

    async def get_active_by_identity(self, identity_id: uuid.UUID) -> list[Session]:
        stmt = select(Session).where(
            Session.identity_id == identity_id, Session.is_active
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def revoke_all_for_identity(self, identity_id: uuid.UUID) -> None:
        stmt = (
            update(Session)
            .where(Session.identity_id == identity_id)
            .values(is_active=False)
        )
        await self.session.execute(stmt)
