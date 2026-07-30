import uuid
from datetime import date

from pydantic import BaseModel, ConfigDict


class HolidayBase(BaseModel):
    pass


class HolidayCreateRequest(HolidayBase):
    name: str
    holiday_date: date
    holiday_type: str = "Organization"


class HolidayUpdateRequest(BaseModel):

    name: str | None = None
    holiday_date: date | None = None
    holiday_type: str = "Organization"


class HolidayResponse(HolidayBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    name: str
    holiday_date: date
    holiday_type: str
