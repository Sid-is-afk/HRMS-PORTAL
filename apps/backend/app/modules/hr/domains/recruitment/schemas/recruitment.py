import uuid

from pydantic import BaseModel, ConfigDict


class RecruitmentBase(BaseModel):
    pass


class RecruitmentCreateRequest(RecruitmentBase):
    title: str
    department_id: uuid.UUID
    workflow_state: str = "Draft"


class RecruitmentUpdateRequest(BaseModel):

    title: str | None = None
    department_id: uuid.UUID | None = None
    workflow_state: str = "Draft"


class RecruitmentResponse(RecruitmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    title: str
    department_id: uuid.UUID
    workflow_state: str
