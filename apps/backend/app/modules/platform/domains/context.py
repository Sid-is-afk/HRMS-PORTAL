import uuid
from collections.abc import AsyncGenerator

from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.jwt import decode_token
from app.database.connection import get_db
from app.modules.auth.domains.roles.repositories.role import RoleRepository
from app.modules.auth.domains.users.repositories.user import UserRepository
from app.modules.platform.domains.context_vars import (
    TenantContext,
    current_tenant_context,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


async def get_tenant_context(
    request: Request,
    token: str | None = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> AsyncGenerator[TenantContext]:
    ctx = TenantContext()
    if token:
        try:
            payload = decode_token(token)
            identity_id_str = payload.get("sub")
            company_id_str = payload.get("company_id")
            roles = payload.get("roles", [])

            if identity_id_str:
                ctx.identity_id = uuid.UUID(identity_id_str)
            if company_id_str:
                ctx.tenant_id = uuid.UUID(company_id_str)

            # Resolve user_id dynamically
            if ctx.identity_id:
                user_repo = UserRepository(db)
                user = await user_repo.get_by_identity_id(ctx.identity_id)
                if user:
                    ctx.user_id = user.id
                    if not ctx.tenant_id:
                        ctx.tenant_id = user.company_id

            if roles:
                ctx.active_role = roles[0]
                # Resolve permissions for user role
                role_repo = RoleRepository(db)
                role_obj = await role_repo.get_by_name(ctx.active_role)
                if role_obj:
                    ctx.permissions = [p.name for p in role_obj.permissions]
        except Exception:
            pass

    token_t = current_tenant_context.set(ctx)
    try:
        yield ctx
    finally:
        current_tenant_context.reset(token_t)
