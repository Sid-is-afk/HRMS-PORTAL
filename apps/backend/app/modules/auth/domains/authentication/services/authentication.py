import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

from app.core.config.settings import get_settings
from app.core.exceptions.base import (
    AuthenticationException,
    NotFoundException,
)
from app.core.security.hashing import verify_password
from app.core.security.jwt import create_access_token, decode_token
from app.modules.auth.domains.identity.services.identity import IdentityService
from app.modules.auth.domains.roles.services.role import RoleService
from app.modules.auth.domains.sessions.services.session import SessionService
from app.modules.auth.domains.tokens.services.token import TokenService
from app.modules.auth.domains.users.services.user import UserService


class AuthenticationService:
    def __init__(
        self,
        identity_service: IdentityService,
        user_service: UserService,
        session_service: SessionService,
        token_service: TokenService,
        role_service: RoleService,
    ):
        self.identity_service = identity_service
        self.user_service = user_service
        self.session_service = session_service
        self.token_service = token_service
        self.role_service = role_service

    async def login(
        self,
        email: str,
        password: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> dict[str, Any]:
        identity = await self.identity_service.get_by_email(email)
        if not identity:
            raise AuthenticationException(
                "INVALID_CREDENTIALS", "Invalid email or password"
            )

        if identity.account_status != "Active":
            raise AuthenticationException(
                "ACCOUNT_NOT_ACTIVE",
                f"Account is in '{identity.account_status}' state",
            )

        # Check lock state
        current_time = datetime.now(UTC).replace(tzinfo=None)
        if identity.lock_until and identity.lock_until > current_time:
            raise AuthenticationException(
                "ACCOUNT_LOCKED", "Account is temporarily locked"
            )

        # Success - reset failed attempts
        current_time = datetime.now(UTC).replace(tzinfo=None)
        if not verify_password(password, identity.password_hash):
            identity.failed_login_attempts += 1
            if identity.failed_login_attempts >= 5:
                identity.lock_until = current_time + timedelta(minutes=15)
                # Reset attempt counter when locking
                identity.failed_login_attempts = 0
            await self.identity_service.update_identity(identity)
            raise AuthenticationException(
                "INVALID_CREDENTIALS", "Invalid email or password"
            )

        # Success - reset failed attempts
        identity.failed_login_attempts = 0
        identity.last_login = current_time
        await self.identity_service.update_identity(identity)

        # Fetch associated user profile
        user = await self.user_service.get_by_identity_id(identity.id)
        if not user:
            raise NotFoundException(
                "USER_PROFILE_NOT_FOUND", "User profile not found for identity"
            )

        # Create session
        settings = get_settings()
        current_time = datetime.now(UTC).replace(tzinfo=None)
        session_expiry = current_time + timedelta(
            minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        )
        session = await self.session_service.create_session(
            identity.id, session_expiry, ip_address, user_agent
        )

        # Create tokens
        access_token = create_access_token(
            {
                "sub": str(identity.id),
                "sid": str(session.id),
                "tver": identity.token_version,
            }
        )

        refresh_expiry = current_time + timedelta(
            days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
        )
        refresh_token_record = await self.token_service.create_refresh_token(
            session.id, refresh_expiry
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token_record.token,
            "user": user,
        }

    async def logout(self, token: str) -> None:
        try:
            payload = decode_token(token)
            session_id = uuid.UUID(payload.get("sid"))
            # Revoke session
            await self.session_service.revoke_session(session_id)
        except Exception:
            raise AuthenticationException("INVALID_TOKEN", "Token is invalid")

    async def refresh_tokens(self, refresh_token_str: str) -> dict[str, str]:
        rt = await self.token_service.verify_refresh_token(refresh_token_str)
        if not rt:
            raise AuthenticationException(
                "INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired"
            )

        session = await self.session_service.get_by_id(rt.session_id)
        if not session or not session.is_active:
            raise AuthenticationException("INACTIVE_SESSION", "Session is inactive")

        identity = await self.identity_service.get_by_id(session.identity_id)
        if not identity or identity.account_status != "Active":
            raise AuthenticationException(
                "INVALID_IDENTITY", "Identity is invalid or inactive"
            )

        # Revoke old refresh token (Token rotation)
        await self.token_service.revoke_refresh_token(refresh_token_str)

        # Create new tokens
        settings = get_settings()
        current_time = datetime.now(UTC).replace(tzinfo=None)
        new_access_token = create_access_token(
            {
                "sub": str(identity.id),
                "sid": str(session.id),
                "tver": identity.token_version,
            }
        )

        refresh_expiry = current_time + timedelta(
            days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
        )
        new_rt = await self.token_service.create_refresh_token(
            session.id, refresh_expiry
        )

        # Extend session expiry
        session.expires_at = current_time + timedelta(
            minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        )
        # Update session
        await self.session_service.repository.create(session)

        return {
            "access_token": new_access_token,
            "refresh_token": new_rt.token,
        }

    async def logout_all(self, identity_id: uuid.UUID) -> None:
        identity = await self.identity_service.get_by_id(identity_id)
        if identity:
            # Increment token version to invalidate all active JWTs
            identity.token_version += 1
            await self.identity_service.update_identity(identity)
            # Revoke all sessions
            await self.session_service.revoke_all_for_identity(identity_id)
