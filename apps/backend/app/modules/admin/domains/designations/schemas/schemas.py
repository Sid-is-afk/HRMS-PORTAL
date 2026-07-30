import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class DesignationBase(BaseModel):
    is_active: bool = True
    effective_from: date
    effective_to: date | None = None

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "DesignationBase":
        if self.effective_from and self.effective_to:
            if self.effective_from > self.effective_to:
                raise ValueError("effective_from must be on or before effective_to")
        return self


class DesignationCreateRequest(DesignationBase):
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=20)
    job_level_id: uuid.UUID
    description: str | None = Field(None, max_length=255)


class DesignationUpdateRequest(BaseModel):
    is_active: bool | None = None
    effective_from: date | None = None
    effective_to: date | None = None
    name: str | None = Field(None, min_length=2, max_length=100)
    code: str | None = Field(None, min_length=2, max_length=20)
    job_level_id: uuid.UUID | None = None
    description: str | None = Field(None, max_length=255)

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "DesignationUpdateRequest":
        ef = self.effective_from
        et = self.effective_to
        if ef and et and ef > et:
            raise ValueError("effective_from must be on or before effective_to")
        return self


class DesignationResponse(DesignationBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    name: str
    code: str
    job_level_id: uuid.UUID
    description: str | None
