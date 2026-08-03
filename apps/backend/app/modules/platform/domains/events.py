import uuid
from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class PlatformDomainEvent(BaseModel):
    event_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    event_type: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None)
    )
    tenant_id: uuid.UUID | None = None
    actor_id: uuid.UUID | None = None
    payload: dict[str, Any] = {}


class TenantCreated(PlatformDomainEvent):
    event_type: str = "TenantCreated"


class TenantValidated(PlatformDomainEvent):
    event_type: str = "TenantValidated"


class TenantProvisioningStarted(PlatformDomainEvent):
    event_type: str = "TenantProvisioningStarted"


class OrganizationCreated(PlatformDomainEvent):
    event_type: str = "OrganizationCreated"


class DefaultRolesSeeded(PlatformDomainEvent):
    event_type: str = "DefaultRolesSeeded"


class AdminIdentityCreated(PlatformDomainEvent):
    event_type: str = "AdminIdentityCreated"


class ModulesEnabled(PlatformDomainEvent):
    event_type: str = "ModulesEnabled"


class ProvisioningCompleted(PlatformDomainEvent):
    event_type: str = "ProvisioningCompleted"


class LicenseAssigned(PlatformDomainEvent):
    event_type: str = "LicenseAssigned"


class FeatureEnabled(PlatformDomainEvent):
    event_type: str = "FeatureEnabled"


class ConfigurationUpdated(PlatformDomainEvent):
    event_type: str = "ConfigurationUpdated"


class TenantSuspended(PlatformDomainEvent):
    event_type: str = "TenantSuspended"


class TenantActivated(PlatformDomainEvent):
    event_type: str = "TenantActivated"
