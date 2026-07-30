import uuid
from datetime import date

from pydantic import BaseModel, ConfigDict


class PromotionBase(BaseModel):
    pass


class PromotionCreateRequest(PromotionBase):
    employee_id: uuid.UUID
    current_designation_id: uuid.UUID
    proposed_designation_id: uuid.UUID
    effective_date: date
    workflow_state: str = "Draft"


class PromotionUpdateRequest(BaseModel):

    employee_id: uuid.UUID | None = None
    current_designation_id: uuid.UUID | None = None
    proposed_designation_id: uuid.UUID | None = None
    effective_date: date | None = None
    workflow_state: str = "Draft"


class PromotionResponse(PromotionBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    employee_id: uuid.UUID
    current_designation_id: uuid.UUID
    proposed_designation_id: uuid.UUID
    effective_date: date
    workflow_state: str
