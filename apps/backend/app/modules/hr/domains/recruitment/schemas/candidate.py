import uuid

from pydantic import BaseModel, ConfigDict


class CandidateBase(BaseModel):
    pass


class CandidateCreateRequest(CandidateBase):
    job_opening_id: uuid.UUID
    first_name: str
    last_name: str
    email: str
    status: str = "Applied"


class CandidateUpdateRequest(BaseModel):

    job_opening_id: uuid.UUID | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    status: str = "Applied"


class CandidateResponse(CandidateBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    job_opening_id: uuid.UUID
    first_name: str
    last_name: str
    email: str
    status: str
