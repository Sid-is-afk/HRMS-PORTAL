import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class FeatureFlagUpdateRequest(BaseModel):
    tenant_id: uuid.UUID | None = None
    key: str = Field(..., max_length=100)
    is_enabled: bool
    rollout_percentage: int = Field(100, ge=0, le=100)
    is_global: bool = False


class FeatureFlagResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID | None
    key: str
    is_enabled: bool
    rollout_percentage: int
    is_global: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
