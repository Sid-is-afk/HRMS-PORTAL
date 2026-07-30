import uuid

from pydantic import BaseModel, ConfigDict


class LeaveTypeBase(BaseModel):
    pass


class LeaveTypeCreateRequest(LeaveTypeBase):
    name: str
    code: str


class LeaveTypeUpdateRequest(BaseModel):

    name: str | None = None
    code: str | None = None


class LeaveTypeResponse(LeaveTypeBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    name: str
    code: str
