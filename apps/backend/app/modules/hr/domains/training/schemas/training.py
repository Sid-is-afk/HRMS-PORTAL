import uuid

from pydantic import BaseModel, ConfigDict


class TrainingBase(BaseModel):
    pass


class TrainingCreateRequest(TrainingBase):
    name: str
    description: str | None = None
    trainer: str | None = None


class TrainingUpdateRequest(BaseModel):

    name: str | None = None
    description: str | None = None
    trainer: str | None = None


class TrainingResponse(TrainingBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    name: str
    description: str | None
    trainer: str | None
