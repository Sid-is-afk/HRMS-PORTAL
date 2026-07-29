import uuid
from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class DomainEvent(BaseModel):
    event_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    event_type: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None)
    )
    employee_id: uuid.UUID
    company_id: uuid.UUID
    actor_id: uuid.UUID | None = None
    payload: dict[str, Any] = {}


class EmployeeCreated(DomainEvent):
    event_type: str = "EmployeeCreated"


class EmployeeUpdated(DomainEvent):
    event_type: str = "EmployeeUpdated"


class EmployeeActivated(DomainEvent):
    event_type: str = "EmployeeActivated"


class EmployeeDeactivated(DomainEvent):
    event_type: str = "EmployeeDeactivated"


class EmployeeDeleted(DomainEvent):
    event_type: str = "EmployeeDeleted"


class EmploymentChanged(DomainEvent):
    event_type: str = "EmploymentChanged"


class ManagerChanged(DomainEvent):
    event_type: str = "ManagerChanged"


class DepartmentChanged(DomainEvent):
    event_type: str = "DepartmentChanged"


class DocumentAdded(DomainEvent):
    event_type: str = "DocumentAdded"


class DocumentRemoved(DomainEvent):
    event_type: str = "DocumentRemoved"
