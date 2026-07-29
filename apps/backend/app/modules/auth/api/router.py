import uuid
from typing import Any

from fastapi import APIRouter, Depends, Request, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.v1.dependencies.auth import (
    get_auth_service,
    get_current_active_identity,
    get_current_user,
    get_session_service,
    oauth2_scheme,
)
from app.modules.auth.api.schemas import (
    MeResponse,
    RefreshRequest,
    SessionResponse,
    TokenResponse,
)
from app.modules.auth.domains.authentication.services.authentication import (
    AuthenticationService,
)
from app.modules.auth.domains.identity.models.identity import Identity
from app.modules.auth.domains.sessions.services.session import SessionService
from app.modules.auth.domains.users.models.user import User

router = APIRouter()


@router.post("/login", response_model=TokenResponse, summary="Login")
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthenticationService = Depends(get_auth_service),
) -> Any:
    # Use standard form fields for OAuth2PasswordRequestForm compatibility
    # with swagger UI
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    result = await auth_service.login(
        email=form_data.username,
        password=form_data.password,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    return {
        "access_token": result["access_token"],
        "refresh_token": result["refresh_token"],
        "token_type": "bearer",
    }


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT, summary="Logout")
async def logout(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthenticationService = Depends(get_auth_service),
) -> None:
    await auth_service.logout(token)


@router.post("/refresh", response_model=TokenResponse, summary="Refresh Token")
async def refresh(
    refresh_req: RefreshRequest,
    auth_service: AuthenticationService = Depends(get_auth_service),
) -> Any:
    result = await auth_service.refresh_tokens(refresh_req.refresh_token)
    return {
        "access_token": result["access_token"],
        "refresh_token": result["refresh_token"],
        "token_type": "bearer",
    }


@router.get("/me", response_model=MeResponse, summary="Get Current Active User info")
async def me(
    current_identity: Identity = Depends(get_current_active_identity),
    current_user: User = Depends(get_current_user),
) -> Any:
    roles = [role.name for role in getattr(current_user, "roles", [])]
    permissions = []
    for role in getattr(current_user, "roles", []):
        for perm in role.permissions:
            permissions.append(perm.name)

    return {
        "user": current_user,
        "email": current_identity.email,
        "account_status": current_identity.account_status,
        "roles": roles,
        "permissions": sorted(list(set(permissions))),
    }


@router.get("/roles", response_model=list[str], summary="Get Roles of Current User")
async def get_roles(
    current_user: User = Depends(get_current_user),
) -> list[str]:
    return [role.name for role in getattr(current_user, "roles", [])]


@router.get(
    "/permissions", response_model=list[str], summary="Get Permissions of Current User"
)
async def get_permissions(
    current_user: User = Depends(get_current_user),
) -> list[str]:
    permissions = []
    for role in getattr(current_user, "roles", []):
        for perm in role.permissions:
            permissions.append(perm.name)
    return sorted(list(set(permissions)))


@router.get(
    "/sessions", response_model=list[SessionResponse], summary="Get active sessions"
)
async def get_sessions(
    current_identity: Identity = Depends(get_current_active_identity),
    session_service: SessionService = Depends(get_session_service),
) -> Any:
    return await session_service.get_active_by_identity(current_identity.id)


@router.delete(
    "/sessions/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Terminate session",
)
async def terminate_session(
    session_id: uuid.UUID,
    current_identity: Identity = Depends(get_current_active_identity),
    session_service: SessionService = Depends(get_session_service),
) -> None:
    session = await session_service.get_by_id(session_id)
    if session and session.identity_id == current_identity.id:
        await session_service.revoke_session(session_id)


@router.post(
    "/logout-all",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Revoke all sessions and force re-login",
)
async def logout_all(
    current_identity: Identity = Depends(get_current_active_identity),
    auth_service: AuthenticationService = Depends(get_auth_service),
) -> None:
    await auth_service.logout_all(current_identity.id)
