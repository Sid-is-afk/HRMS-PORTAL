import uuid
from datetime import date

from pydantic import BaseModel, ConfigDict


class OffboardingBase(BaseModel):
    pass


class OffboardingCreateRequest(OffboardingBase):
    employee_id: uuid.UUID
    resignation_date: date
    workflow_state: str = "Requested"


class OffboardingUpdateRequest(BaseModel):

    employee_id: uuid.UUID | None = None
    resignation_date: date | None = None
    workflow_state: str = "Requested"


class OffboardingResponse(OffboardingBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    employee_id: uuid.UUID
    resignation_date: date
    workflow_state: str
