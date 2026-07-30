import uuid
from datetime import time

from pydantic import BaseModel, ConfigDict


class ShiftBase(BaseModel):
    pass


class ShiftCreateRequest(ShiftBase):
    name: str
    code: str
    start_time: time
    end_time: time


class ShiftUpdateRequest(BaseModel):

    name: str | None = None
    code: str | None = None
    start_time: time | None = None
    end_time: time | None = None


class ShiftResponse(ShiftBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    name: str
    code: str
    start_time: time
    end_time: time
