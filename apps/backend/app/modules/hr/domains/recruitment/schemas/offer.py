import uuid
from datetime import date

from pydantic import BaseModel, ConfigDict


class OfferBase(BaseModel):
    pass


class OfferCreateRequest(OfferBase):
    candidate_id: uuid.UUID
    offered_position_id: uuid.UUID
    salary: float
    joining_date: date
    status: str = "Pending"


class OfferUpdateRequest(BaseModel):

    candidate_id: uuid.UUID | None = None
    offered_position_id: uuid.UUID | None = None
    salary: float | None = None
    joining_date: date | None = None
    status: str = "Pending"


class OfferResponse(OfferBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    candidate_id: uuid.UUID
    offered_position_id: uuid.UUID
    salary: float
    joining_date: date
    status: str
