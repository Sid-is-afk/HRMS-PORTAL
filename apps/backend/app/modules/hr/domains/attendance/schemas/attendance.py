import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class AttendanceBase(BaseModel):
    pass


class AttendanceCreateRequest(AttendanceBase):
    employee_id: uuid.UUID
    check_in: datetime
    check_out: datetime | None = None
    breaks: dict[str, Any] | None = None
    overtime: int = 0
    status: str = "Present"
    workflow_state: str = "Draft"


class AttendanceUpdateRequest(BaseModel):

    employee_id: uuid.UUID | None = None
    check_in: datetime | None = None
    check_out: datetime | None = None
    breaks: dict[str, Any] | None = None
    overtime: int = 0
    status: str = "Present"
    workflow_state: str = "Draft"


class AttendanceResponse(AttendanceBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    employee_id: uuid.UUID
    check_in: datetime
    check_out: datetime | None
    breaks: dict[str, Any] | None | None
    overtime: int
    status: str
    workflow_state: str
