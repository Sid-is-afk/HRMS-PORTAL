import uuid
from datetime import datetime

from pydantic import BaseModel


class ProvisionRequest(BaseModel):
    tenant_id: uuid.UUID


class ProvisioningHistoryResponse(BaseModel):
    id: uuid.UUID
    step: str
    status: str
    error_message: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class ProvisioningJobResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    status: str
    current_step: str | None
    error_message: str | None
    retry_count: int
    created_at: datetime
    updated_at: datetime
    histories: list[ProvisioningHistoryResponse] = []

    class Config:
        from_attributes = True
