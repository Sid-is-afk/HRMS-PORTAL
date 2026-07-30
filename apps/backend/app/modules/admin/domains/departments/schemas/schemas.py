import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class DepartmentBase(BaseModel):
    is_active: bool = True
    effective_from: date
    effective_to: date | None = None

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "DepartmentBase":
        if self.effective_from and self.effective_to:
            if self.effective_from > self.effective_to:
                raise ValueError("effective_from must be on or before effective_to")
        return self


class DepartmentCreateRequest(DepartmentBase):
    division_id: uuid.UUID
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=20)
    description: str | None = Field(None, max_length=255)
    head_placeholder: str | None = Field(None, max_length=100)


class DepartmentUpdateRequest(BaseModel):
    is_active: bool | None = None
    effective_from: date | None = None
    effective_to: date | None = None
    division_id: uuid.UUID | None = None
    name: str | None = Field(None, min_length=2, max_length=100)
    code: str | None = Field(None, min_length=2, max_length=20)
    description: str | None = Field(None, max_length=255)
    head_placeholder: str | None = Field(None, max_length=100)

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "DepartmentUpdateRequest":
        ef = self.effective_from
        et = self.effective_to
        if ef and et and ef > et:
            raise ValueError("effective_from must be on or before effective_to")
        return self


class DepartmentResponse(DepartmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    division_id: uuid.UUID
    name: str
    code: str
    description: str | None
    head_placeholder: str | None
