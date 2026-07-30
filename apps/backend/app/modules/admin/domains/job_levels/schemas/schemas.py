import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class JobLevelBase(BaseModel):
    is_active: bool = True
    effective_from: date
    effective_to: date | None = None

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "JobLevelBase":
        if self.effective_from and self.effective_to:
            if self.effective_from > self.effective_to:
                raise ValueError("effective_from must be on or before effective_to")
        return self


class JobLevelCreateRequest(JobLevelBase):
    name: str = Field(..., min_length=2, max_length=100)
    hierarchy_order: int = Field(..., ge=0)
    description: str | None = Field(None, max_length=255)


class JobLevelUpdateRequest(BaseModel):
    is_active: bool | None = None
    effective_from: date | None = None
    effective_to: date | None = None
    name: str | None = Field(None, min_length=2, max_length=100)
    hierarchy_order: int | None = Field(None, ge=0)
    description: str | None = Field(None, max_length=255)

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "JobLevelUpdateRequest":
        ef = self.effective_from
        et = self.effective_to
        if ef and et and ef > et:
            raise ValueError("effective_from must be on or before effective_to")
        return self


class JobLevelResponse(JobLevelBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    name: str
    hierarchy_order: int
    description: str | None
