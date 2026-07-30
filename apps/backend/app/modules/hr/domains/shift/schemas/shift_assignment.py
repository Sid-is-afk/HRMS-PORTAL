import uuid
from datetime import date

from pydantic import BaseModel, ConfigDict


class ShiftAssignmentBase(BaseModel):
    pass


class ShiftAssignmentCreateRequest(ShiftAssignmentBase):
    employee_id: uuid.UUID
    shift_id: uuid.UUID
    start_date: date
    end_date: date | None = None


class ShiftAssignmentUpdateRequest(BaseModel):

    employee_id: uuid.UUID | None = None
    shift_id: uuid.UUID | None = None
    start_date: date | None = None
    end_date: date | None = None


class ShiftAssignmentResponse(ShiftAssignmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    employee_id: uuid.UUID
    shift_id: uuid.UUID
    start_date: date
    end_date: date | None
