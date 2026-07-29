import uuid
from datetime import datetime

from app.modules.auth.domains.sessions.models.session import Session
from app.modules.auth.domains.sessions.repositories.session import SessionRepository


class SessionService:
    def __init__(self, repository: SessionRepository):
        self.repository = repository

    async def create_session(
        self,
        identity_id: uuid.UUID,
        expires_at: datetime,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> Session:
        session = Session(
            identity_id=identity_id,
            ip_address=ip_address,
            user_agent=user_agent,
            is_active=True,
            expires_at=expires_at,
        )
        return await self.repository.create(session)

    async def get_by_id(self, session_id: uuid.UUID) -> Session | None:
        return await self.repository.get_by_id(session_id)

    async def get_active_by_identity(self, identity_id: uuid.UUID) -> list[Session]:
        return await self.repository.get_active_by_identity(identity_id)

    async def revoke_session(self, session_id: uuid.UUID) -> None:
        await self.repository.update_by_id(session_id, is_active=False)

    async def revoke_all_for_identity(self, identity_id: uuid.UUID) -> None:
        await self.repository.revoke_all_for_identity(identity_id)
