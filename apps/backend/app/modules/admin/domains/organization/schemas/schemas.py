import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class OrganizationBase(BaseModel):
    is_active: bool = True
    effective_from: date
    effective_to: date | None = None

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "OrganizationBase":
        if self.effective_from and self.effective_to:
            if self.effective_from > self.effective_to:
                raise ValueError("effective_from must be on or before effective_to")
        return self


class OrganizationCreateRequest(OrganizationBase):
    parent_organization_id: uuid.UUID | None = None
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=20)
    org_type: str | None = Field(None, max_length=50)
    description: str | None = Field(None, max_length=255)
    status: str = "ACTIVE"


class OrganizationUpdateRequest(BaseModel):
    is_active: bool | None = None
    effective_from: date | None = None
    effective_to: date | None = None
    parent_organization_id: uuid.UUID | None = None
    name: str | None = Field(None, min_length=2, max_length=100)
    code: str | None = Field(None, min_length=2, max_length=20)
    org_type: str | None = Field(None, max_length=50)
    description: str | None = Field(None, max_length=255)
    status: str = "ACTIVE"

    @model_validator(mode="after")
    def validate_effective_dates(self) -> "OrganizationUpdateRequest":
        ef = self.effective_from
        et = self.effective_to
        if ef and et and ef > et:
            raise ValueError("effective_from must be on or before effective_to")
        return self


class OrganizationResponse(OrganizationBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    parent_organization_id: uuid.UUID | None
    name: str
    code: str
    org_type: str | None
    description: str | None
    status: str
