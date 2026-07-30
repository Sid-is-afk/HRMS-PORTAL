import uuid

from pydantic import BaseModel, ConfigDict


class LeaveBalanceBase(BaseModel):
    pass


class LeaveBalanceCreateRequest(LeaveBalanceBase):
    employee_id: uuid.UUID
    leave_type_id: uuid.UUID
    balance: float = 0.0


class LeaveBalanceUpdateRequest(BaseModel):

    employee_id: uuid.UUID | None = None
    leave_type_id: uuid.UUID | None = None
    balance: float = 0.0


class LeaveBalanceResponse(LeaveBalanceBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    employee_id: uuid.UUID
    leave_type_id: uuid.UUID
    balance: float
