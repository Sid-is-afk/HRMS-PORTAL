import uuid

from pydantic import BaseModel, ConfigDict


class OnboardingBase(BaseModel):
    pass


class OnboardingCreateRequest(OnboardingBase):
    employee_id: uuid.UUID
    buddy_id: uuid.UUID | None = None
    workflow_state: str = "Created"


class OnboardingUpdateRequest(BaseModel):

    employee_id: uuid.UUID | None = None
    buddy_id: uuid.UUID | None = None
    workflow_state: str = "Created"


class OnboardingResponse(OnboardingBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    employee_id: uuid.UUID
    buddy_id: uuid.UUID | None
    workflow_state: str
