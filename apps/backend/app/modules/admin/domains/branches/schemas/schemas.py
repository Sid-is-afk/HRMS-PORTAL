import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class BranchBase(BaseModel):
    is_active: bool = True
    effective_from: date
    effective_to: date | None = None

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "BranchBase":
        if self.effective_from and self.effective_to:
            if self.effective_from > self.effective_to:
                raise ValueError("effective_from must be on or before effective_to")
        return self


class BranchCreateRequest(BranchBase):
    organization_id: uuid.UUID
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=20)
    address: str | None = Field(None, max_length=255)
    city: str | None = Field(None, max_length=100)
    state: str | None = Field(None, max_length=100)
    country: str | None = Field(None, max_length=100)
    postal_code: str | None = Field(None, max_length=20)


class BranchUpdateRequest(BaseModel):
    is_active: bool | None = None
    effective_from: date | None = None
    effective_to: date | None = None
    organization_id: uuid.UUID | None = None
    name: str | None = Field(None, min_length=2, max_length=100)
    code: str | None = Field(None, min_length=2, max_length=20)
    address: str | None = Field(None, max_length=255)
    city: str | None = Field(None, max_length=100)
    state: str | None = Field(None, max_length=100)
    country: str | None = Field(None, max_length=100)
    postal_code: str | None = Field(None, max_length=20)

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "BranchUpdateRequest":
        ef = self.effective_from
        et = self.effective_to
        if ef and et and ef > et:
            raise ValueError("effective_from must be on or before effective_to")
        return self


class BranchResponse(BranchBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    organization_id: uuid.UUID
    name: str
    code: str
    address: str | None
    city: str | None
    state: str | None
    country: str | None
    postal_code: str | None
