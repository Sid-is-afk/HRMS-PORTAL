import uuid
from datetime import datetime

from typing import Any

from pydantic import BaseModel, Field


class LicenseCreateRequest(BaseModel):
    tenant_id: uuid.UUID
    plan: str = Field(..., max_length=50)
    features: dict[str, Any] | None = None
    user_limits: int = Field(0, ge=0)
    storage_limits: int = Field(0, ge=0)
    api_limits: int = Field(0, ge=0)
    expires_at: datetime | None = None


class LicenseResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    plan: str
    features: dict[str, Any] | None
    user_limits: int
    storage_limits: int
    api_limits: int
    expires_at: datetime | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
