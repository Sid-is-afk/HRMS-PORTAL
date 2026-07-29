import secrets
import uuid
from datetime import UTC, datetime

from app.modules.auth.domains.tokens.models.refresh_token import RefreshToken
from app.modules.auth.domains.tokens.repositories.refresh_token import (
    RefreshTokenRepository,
)


class TokenService:
    def __init__(self, repository: RefreshTokenRepository):
        self.repository = repository

    async def create_refresh_token(
        self, session_id: uuid.UUID, expires_at: datetime
    ) -> RefreshToken:
        token_str = secrets.token_urlsafe(64)
        rt = RefreshToken(
            session_id=session_id,
            token=token_str,
            is_revoked=False,
            expires_at=expires_at,
        )
        return await self.repository.create(rt)

    async def verify_refresh_token(self, token: str) -> RefreshToken | None:
        rt = await self.repository.get_by_token(token)
        if not rt:
            return None
        # Align with SQLite/PostgreSQL which store naive UTC datetimes by mapping
        # to naive comparison. For standard SQLite naive comparison is safest:
        current_time = datetime.now(UTC).replace(tzinfo=None)
        if rt.is_revoked or rt.expires_at < current_time:
            return None
        return rt

    async def revoke_refresh_token(self, token: str) -> None:
        rt = await self.repository.get_by_token(token)
        if rt:
            await self.repository.update_by_id(rt.id, is_revoked=True)
