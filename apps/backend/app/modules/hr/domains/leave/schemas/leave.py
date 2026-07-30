import uuid
from datetime import date

from pydantic import BaseModel, ConfigDict


class LeaveBase(BaseModel):
    pass


class LeaveCreateRequest(LeaveBase):
    employee_id: uuid.UUID
    leave_type_id: uuid.UUID
    start_date: date
    end_date: date
    workflow_state: str = "Draft"


class LeaveUpdateRequest(BaseModel):

    employee_id: uuid.UUID | None = None
    leave_type_id: uuid.UUID | None = None
    start_date: date | None = None
    end_date: date | None = None
    workflow_state: str = "Draft"


class LeaveResponse(LeaveBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    employee_id: uuid.UUID
    leave_type_id: uuid.UUID
    start_date: date
    end_date: date
    workflow_state: str


class EmployeeLeaveBalanceSummary(BaseModel):
    total: int
    used: int
    remaining: int
    pending: int


class EmployeeLeaveHistoryItem(BaseModel):
    id: str
    leaveType: str
    startDate: str
    endDate: str
    halfDay: bool
    reason: str
    status: str
    duration: float
    createdAt: str

