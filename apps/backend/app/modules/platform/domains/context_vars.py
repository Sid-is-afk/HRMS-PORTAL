import uuid
from contextvars import ContextVar
from dataclasses import dataclass, field


@dataclass
class TenantContext:
    tenant_id: uuid.UUID | None = None
    identity_id: uuid.UUID | None = None
    user_id: uuid.UUID | None = None
    active_role: str | None = None
    permissions: list[str] = field(default_factory=list)


current_tenant_context: ContextVar[TenantContext] = ContextVar(
    "current_tenant_context", default=TenantContext()
)

bypass_tenant_context: ContextVar[bool] = ContextVar(
    "bypass_tenant_context", default=False
)
