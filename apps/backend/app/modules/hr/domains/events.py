import uuid
from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class HRDomainEvent(BaseModel):
    event_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    event_type: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None)
    )
    company_id: uuid.UUID
    actor_id: uuid.UUID | None = None
    payload: dict[str, Any] = {}


class AttendanceSubmitted(HRDomainEvent):
    event_type: str = "AttendanceSubmitted"


class AttendanceApproved(HRDomainEvent):
    event_type: str = "AttendanceApproved"


class LeaveSubmitted(HRDomainEvent):
    event_type: str = "LeaveSubmitted"


class LeaveApproved(HRDomainEvent):
    event_type: str = "LeaveApproved"


class LeaveRejected(HRDomainEvent):
    event_type: str = "LeaveRejected"


class RecruitmentPublished(HRDomainEvent):
    event_type: str = "RecruitmentPublished"


class CandidateInterviewScheduled(HRDomainEvent):
    event_type: str = "CandidateInterviewScheduled"


class OfferReleased(HRDomainEvent):
    event_type: str = "OfferReleased"


class OfferAccepted(HRDomainEvent):
    event_type: str = "OfferAccepted"


class EmployeeOnboarded(HRDomainEvent):
    event_type: str = "EmployeeOnboarded"


class EmployeeOffboarded(HRDomainEvent):
    event_type: str = "EmployeeOffboarded"


class PromotionApproved(HRDomainEvent):
    event_type: str = "PromotionApproved"


class TransferApproved(HRDomainEvent):
    event_type: str = "TransferApproved"


class PerformanceCompleted(HRDomainEvent):
    event_type: str = "PerformanceCompleted"


class TrainingCompleted(HRDomainEvent):
    event_type: str = "TrainingCompleted"
