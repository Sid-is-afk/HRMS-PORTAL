import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class BusinessUnitBase(BaseModel):
    is_active: bool = True
    effective_from: date
    effective_to: date | None = None

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "BusinessUnitBase":
        if self.effective_from and self.effective_to:
            if self.effective_from > self.effective_to:
                raise ValueError("effective_from must be on or before effective_to")
        return self


class BusinessUnitCreateRequest(BusinessUnitBase):
    organization_id: uuid.UUID
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=20)
    description: str | None = Field(None, max_length=255)


class BusinessUnitUpdateRequest(BaseModel):
    is_active: bool | None = None
    effective_from: date | None = None
    effective_to: date | None = None
    organization_id: uuid.UUID | None = None
    name: str | None = Field(None, min_length=2, max_length=100)
    code: str | None = Field(None, min_length=2, max_length=20)
    description: str | None = Field(None, max_length=255)

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "BusinessUnitUpdateRequest":
        ef = self.effective_from
        et = self.effective_to
        if ef and et and ef > et:
            raise ValueError("effective_from must be on or before effective_to")
        return self


class BusinessUnitResponse(BusinessUnitBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    organization_id: uuid.UUID
    name: str
    code: str
    description: str | None
