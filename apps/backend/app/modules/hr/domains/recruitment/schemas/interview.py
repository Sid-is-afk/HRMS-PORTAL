import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InterviewBase(BaseModel):
    pass


class InterviewCreateRequest(InterviewBase):
    candidate_id: uuid.UUID
    interviewer_id: uuid.UUID
    interview_date: datetime
    feedback: str | None = None
    rating: int | None = None


class InterviewUpdateRequest(BaseModel):

    candidate_id: uuid.UUID | None = None
    interviewer_id: uuid.UUID | None = None
    interview_date: datetime | None = None
    feedback: str | None = None
    rating: int | None = None


class InterviewResponse(InterviewBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    candidate_id: uuid.UUID
    interviewer_id: uuid.UUID
    interview_date: datetime
    feedback: str | None
    rating: int | None
