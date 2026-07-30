import uuid

from pydantic import BaseModel, ConfigDict


class PerformanceReviewBase(BaseModel):
    pass


class PerformanceReviewCreateRequest(PerformanceReviewBase):
    employee_id: uuid.UUID
    reviewer_id: uuid.UUID
    rating: float | None = None
    feedback: str | None = None
    workflow_state: str = "Draft"


class PerformanceReviewUpdateRequest(BaseModel):

    employee_id: uuid.UUID | None = None
    reviewer_id: uuid.UUID | None = None
    rating: float | None = None
    feedback: str | None = None
    workflow_state: str = "Draft"


class PerformanceReviewResponse(PerformanceReviewBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    employee_id: uuid.UUID
    reviewer_id: uuid.UUID
    rating: float | None
    feedback: str | None
    workflow_state: str
