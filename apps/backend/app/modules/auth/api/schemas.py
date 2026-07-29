import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    ip_address: str | None
    user_agent: str | None
    is_active: bool
    expires_at: datetime
    created_at: datetime


class UserUpdate(BaseModel):
    display_name: str | None = None
    avatar: str | None = None
    profile_info: dict[str, Any] | None = None


class RoleAssignment(BaseModel):
    user_id: uuid.UUID
    role_name: str


class PermissionAssignment(BaseModel):
    role_name: str
    permission_name: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    identity_id: uuid.UUID
    company_id: uuid.UUID
    display_name: str
    avatar: str | None
    profile_info: dict[str, Any] | None
    created_at: datetime


class MeResponse(BaseModel):
    user: UserResponse
    email: EmailStr
    account_status: str
    roles: list[str]
    permissions: list[str]
