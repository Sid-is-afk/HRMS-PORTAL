import uuid
from typing import Any

from app.modules.platform.domains.audit.models.audit import PlatformAudit
from app.modules.platform.domains.audit.repositories.audit import (
    PlatformAuditRepository,
)


class PlatformAdministrationService:
    def __init__(self, audit_repo: PlatformAuditRepository):
        self.audit_repo = audit_repo

    async def log_platform_action(
        self,
        tenant_id: uuid.UUID | None,
        actor_id: uuid.UUID | None,
        action: str,
        entity_type: str,
        entity_id: uuid.UUID | None = None,
        previous_value: dict[str, Any] | None = None,
        new_value: dict[str, Any] | None = None,
    ) -> PlatformAudit:
        audit = PlatformAudit(
            tenant_id=tenant_id,
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            previous_value=previous_value,
            new_value=new_value,
        )
        return await self.audit_repo.create(audit)

    async def get_audit_logs(
        self,
        page: int,
        size: int,
        tenant_id: uuid.UUID | None = None,
        actor_id: uuid.UUID | None = None,
        action: str | None = None,
    ) -> tuple[list[PlatformAudit], int]:
        return await self.audit_repo.get_paginated(
            page=page, size=size, tenant_id=tenant_id, actor_id=actor_id, action=action
        )
