import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class ConfigurationUpdateRequest(BaseModel):
    tenant_id: uuid.UUID | None = None
    key: str = Field(..., max_length=100)
    value: str = Field(..., max_length=255)
    is_global: bool = False


class ConfigurationResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID | None
    key: str
    value: str
    version: int
    is_global: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
