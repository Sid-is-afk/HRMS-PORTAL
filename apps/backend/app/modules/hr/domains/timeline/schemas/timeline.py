import uuid

from pydantic import BaseModel, ConfigDict


class AuditTimelineBase(BaseModel):
    pass


class AuditTimelineCreateRequest(AuditTimelineBase):
    entity_type: str
    entity_id: uuid.UUID
    previous_state: str
    new_state: str
    actor_id: uuid.UUID | None = None
    comment: str | None = None
    reason: str | None = None


class AuditTimelineUpdateRequest(BaseModel):

    entity_type: str | None = None
    entity_id: uuid.UUID | None = None
    previous_state: str | None = None
    new_state: str | None = None
    actor_id: uuid.UUID | None = None
    comment: str | None = None
    reason: str | None = None


class AuditTimelineResponse(AuditTimelineBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    entity_type: str
    entity_id: uuid.UUID
    previous_state: str
    new_state: str
    actor_id: uuid.UUID | None
    comment: str | None
    reason: str | None


class StateTransitionRequest(BaseModel):
    state: str
    comment: str | None = None
    reason: str | None = None
