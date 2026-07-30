import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class LocationBase(BaseModel):
    is_active: bool = True
    effective_from: date
    effective_to: date | None = None

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "LocationBase":
        if self.effective_from and self.effective_to:
            if self.effective_from > self.effective_to:
                raise ValueError("effective_from must be on or before effective_to")
        return self


class LocationCreateRequest(LocationBase):
    branch_id: uuid.UUID
    name: str = Field(..., min_length=2, max_length=100)
    location_type: str | None = Field(None, max_length=50)
    timezone: str | None = Field(None, max_length=50)
    address: str | None = Field(None, max_length=255)


class LocationUpdateRequest(BaseModel):
    is_active: bool | None = None
    effective_from: date | None = None
    effective_to: date | None = None
    branch_id: uuid.UUID | None = None
    name: str | None = Field(None, min_length=2, max_length=100)
    location_type: str | None = Field(None, max_length=50)
    timezone: str | None = Field(None, max_length=50)
    address: str | None = Field(None, max_length=255)

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "LocationUpdateRequest":
        ef = self.effective_from
        et = self.effective_to
        if ef and et and ef > et:
            raise ValueError("effective_from must be on or before effective_to")
        return self


class LocationResponse(LocationBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    branch_id: uuid.UUID
    name: str
    location_type: str | None
    timezone: str | None
    address: str | None
