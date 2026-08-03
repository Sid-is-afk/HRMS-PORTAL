import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class TenantCreateRequest(BaseModel):
    tenant_code: str = Field(..., max_length=50)
    tenant_name: str = Field(..., max_length=150)
    subscription_plan: str = Field("Free", max_length=50)


class TenantUpdateRequest(BaseModel):
    tenant_name: str | None = Field(None, max_length=150)
    subscription_plan: str | None = Field(None, max_length=50)


class TenantResponse(BaseModel):
    id: uuid.UUID
    tenant_code: str
    tenant_name: str
    organization_id: uuid.UUID | None
    status: str
    subscription_plan: str
    license_id: uuid.UUID | None
    provisioning_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
