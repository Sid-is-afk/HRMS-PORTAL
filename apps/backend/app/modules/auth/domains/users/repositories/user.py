import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database.repository import BaseRepository
from app.modules.auth.domains.roles.models.role import Role
from app.modules.auth.domains.users.models.user import User


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_identity_id(self, identity_id: uuid.UUID) -> User | None:
        stmt = (
            select(User)
            .where(User.identity_id == identity_id)
            .options(
                selectinload(User.roles).selectinload(Role.permissions)  # type: ignore[attr-defined]
            )
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()
