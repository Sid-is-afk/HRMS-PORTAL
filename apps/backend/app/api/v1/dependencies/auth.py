import uuid

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions.base import (
    AuthenticationException,
    AuthorizationException,
    NotFoundException,
)
from app.core.security.jwt import decode_token
from app.database.connection import get_db
from app.modules.auth.domains.authentication.services.authentication import (
    AuthenticationService,
)
from app.modules.auth.domains.identity.models.identity import Identity
from app.modules.auth.domains.identity.repositories.identity import IdentityRepository
from app.modules.auth.domains.identity.services.identity import IdentityService
from app.modules.auth.domains.permissions.repositories.permission import (
    PermissionRepository,
)
from app.modules.auth.domains.permissions.services.permission import PermissionService
from app.modules.auth.domains.roles.repositories.role import RoleRepository
from app.modules.auth.domains.roles.services.role import RoleService
from app.modules.auth.domains.sessions.repositories.session import SessionRepository
from app.modules.auth.domains.sessions.services.session import SessionService
from app.modules.auth.domains.tokens.repositories.refresh_token import (
    RefreshTokenRepository,
)
from app.modules.auth.domains.tokens.services.token import TokenService
from app.modules.auth.domains.users.models.user import User
from app.modules.auth.domains.users.repositories.user import UserRepository
from app.modules.auth.domains.users.services.user import UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_identity_service(db: AsyncSession = Depends(get_db)) -> IdentityService:
    repo = IdentityRepository(db)
    return IdentityService(repo)


async def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    repo = UserRepository(db)
    return UserService(repo)


async def get_session_service(db: AsyncSession = Depends(get_db)) -> SessionService:
    repo = SessionRepository(db)
    return SessionService(repo)


async def get_token_service(db: AsyncSession = Depends(get_db)) -> TokenService:
    repo = RefreshTokenRepository(db)
    return TokenService(repo)


async def get_role_service(db: AsyncSession = Depends(get_db)) -> RoleService:
    repo = RoleRepository(db)
    return RoleService(repo)


async def get_permission_service(
    db: AsyncSession = Depends(get_db),
) -> PermissionService:
    repo = PermissionRepository(db)
    return PermissionService(repo)


async def get_auth_service(
    identity_service: IdentityService = Depends(get_identity_service),
    user_service: UserService = Depends(get_user_service),
    session_service: SessionService = Depends(get_session_service),
    token_service: TokenService = Depends(get_token_service),
    role_service: RoleService = Depends(get_role_service),
) -> AuthenticationService:
    return AuthenticationService(
        identity_service, user_service, session_service, token_service, role_service
    )


async def get_current_identity(
    token: str = Depends(oauth2_scheme),
    identity_service: IdentityService = Depends(get_identity_service),
    session_service: SessionService = Depends(get_session_service),
) -> Identity:
    try:
        payload = decode_token(token)
        identity_id = uuid.UUID(payload.get("sub"))
        session_id = uuid.UUID(payload.get("sid"))
        token_version = payload.get("tver")
    except Exception:
        raise AuthenticationException("INVALID_TOKEN", "Token is invalid or malformed")

    identity = await identity_service.get_by_id(identity_id)
    if not identity:
        raise AuthenticationException("IDENTITY_NOT_FOUND", "Identity does not exist")

    # Check token versioning revocation
    if identity.token_version != token_version:
        raise AuthenticationException(
            "TOKEN_REVOKED", "Token has been revoked or expired"
        )

    # Check session
    session = await session_service.get_by_id(session_id)
    if not session or not session.is_active:
        raise AuthenticationException("SESSION_REVOKED", "Session has been terminated")

    return identity


async def get_current_active_identity(
    current_identity: Identity = Depends(get_current_identity),
) -> Identity:
    if current_identity.account_status != "Active":
        raise AuthenticationException(
            "ACCOUNT_INACTIVE", f"Account status is '{current_identity.account_status}'"
        )
    return current_identity


async def get_current_user(
    current_identity: Identity = Depends(get_current_active_identity),
    user_service: UserService = Depends(get_user_service),
) -> User:
    user = await user_service.get_by_identity_id(current_identity.id)
    if not user:
        raise NotFoundException("USER_PROFILE_NOT_FOUND", "User profile not found")
    return user


class PermissionGuard:
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    async def __call__(
        self,
        current_user: User = Depends(get_current_user),
    ) -> User:
        # Resolve user permissions via SQLAlchemy eager-loaded roles and permissions
        user_permissions = []
        for role in getattr(current_user, "roles", []):
            for perm in role.permissions:
                user_permissions.append(perm.name)

        # Check SuperUser override or specific permission match
        if (
            "platform:manage" in user_permissions
            or self.required_permission in user_permissions
        ):
            return current_user

        raise AuthorizationException(
            "PERMISSION_DENIED", "Insufficient permissions to access this resource"
        )


class RoleGuard:
    def __init__(self, required_role: str):
        self.required_role = required_role

    async def __call__(
        self,
        current_user: User = Depends(get_current_user),
    ) -> User:
        user_roles = [role.name for role in getattr(current_user, "roles", [])]
        if "SuperUser" in user_roles or self.required_role in user_roles:
            return current_user

        raise AuthorizationException(
            "ROLE_DENIED", "Insufficient roles to access this resource"
        )
