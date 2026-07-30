import uuid
from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class AdminDomainEvent(BaseModel):
    event_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    event_type: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None)
    )
    company_id: uuid.UUID
    actor_id: uuid.UUID | None = None
    payload: dict[str, Any] = {}


class OrganizationCreated(AdminDomainEvent):
    event_type: str = "OrganizationCreated"


class OrganizationUpdated(AdminDomainEvent):
    event_type: str = "OrganizationUpdated"


class OrganizationArchived(AdminDomainEvent):
    event_type: str = "OrganizationArchived"


class BusinessUnitCreated(AdminDomainEvent):
    event_type: str = "BusinessUnitCreated"


class DivisionCreated(AdminDomainEvent):
    event_type: str = "DivisionCreated"


class DepartmentCreated(AdminDomainEvent):
    event_type: str = "DepartmentCreated"


class DepartmentUpdated(AdminDomainEvent):
    event_type: str = "DepartmentUpdated"


class DepartmentArchived(AdminDomainEvent):
    event_type: str = "DepartmentArchived"


class TeamCreated(AdminDomainEvent):
    event_type: str = "TeamCreated"


class DesignationCreated(AdminDomainEvent):
    event_type: str = "DesignationCreated"


class JobLevelCreated(AdminDomainEvent):
    event_type: str = "JobLevelCreated"


class BranchCreated(AdminDomainEvent):
    event_type: str = "BranchCreated"


class LocationCreated(AdminDomainEvent):
    event_type: str = "LocationCreated"


class CostCenterCreated(AdminDomainEvent):
    event_type: str = "CostCenterCreated"


class OrganizationRestructured(AdminDomainEvent):
    event_type: str = "OrganizationRestructured"
