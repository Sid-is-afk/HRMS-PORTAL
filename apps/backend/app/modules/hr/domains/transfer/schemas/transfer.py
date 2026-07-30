import uuid
from datetime import date

from pydantic import BaseModel, ConfigDict


class TransferBase(BaseModel):
    pass


class TransferCreateRequest(TransferBase):
    employee_id: uuid.UUID
    current_department_id: uuid.UUID
    proposed_department_id: uuid.UUID
    proposed_manager_id: uuid.UUID
    effective_date: date
    workflow_state: str = "Draft"


class TransferUpdateRequest(BaseModel):

    employee_id: uuid.UUID | None = None
    current_department_id: uuid.UUID | None = None
    proposed_department_id: uuid.UUID | None = None
    proposed_manager_id: uuid.UUID | None = None
    effective_date: date | None = None
    workflow_state: str = "Draft"


class TransferResponse(TransferBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    employee_id: uuid.UUID
    current_department_id: uuid.UUID
    proposed_department_id: uuid.UUID
    proposed_manager_id: uuid.UUID
    effective_date: date
    workflow_state: str
