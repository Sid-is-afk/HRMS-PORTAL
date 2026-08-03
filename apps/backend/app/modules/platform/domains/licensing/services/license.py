import uuid
from datetime import datetime

from app.core.exceptions.base import BusinessException
from app.events.publishers.platform import publish_platform_event
from app.modules.platform.domains.events import LicenseAssigned
from app.modules.platform.domains.licensing.models.license import License
from app.modules.platform.domains.licensing.repositories.license import (
    LicenseRepository,
)
from app.modules.platform.domains.licensing.schemas.license import LicenseCreateRequest


class LicenseService:
    def __init__(self, repo: LicenseRepository):
        self.repo = repo

    async def get_license(self, license_id: uuid.UUID) -> License:
        lic = await self.repo.get_by_id(license_id)
        if not lic or lic.deleted_at is not None:
            raise BusinessException("ENTITY_NOT_FOUND", "License not found")
        return lic

    async def create_license(
        self, company_id: uuid.UUID, payload: LicenseCreateRequest
    ) -> License:
        # Check active license and deactivate it if exists
        active = await self.repo.get_active_by_tenant_id(payload.tenant_id)
        if active:
            active.is_active = False
            await self.repo.create(active)

        lic = License(
            tenant_id=payload.tenant_id,
            plan=payload.plan,
            features=payload.features,
            user_limits=payload.user_limits,
            storage_limits=payload.storage_limits,
            api_limits=payload.api_limits,
            expires_at=payload.expires_at,
            is_active=True,
        )
        saved = await self.repo.create(lic)

        # Publish event
        await publish_platform_event(
            LicenseAssigned(
                tenant_id=payload.tenant_id,
                payload={"license_id": str(saved.id), "plan": saved.plan},
            )
        )
        return saved

    async def get_active_license(self, tenant_id: uuid.UUID) -> License | None:
        return await self.repo.get_active_by_tenant_id(tenant_id)

    async def validate_user_limit(
        self, tenant_id: uuid.UUID, current_user_count: int
    ) -> None:
        lic = await self.get_active_license(tenant_id)
        if not lic:
            raise BusinessException(
                "INVALID_LICENSE", "No active license found for tenant"
            )

        if lic.expires_at and lic.expires_at < datetime.now():
            raise BusinessException("INVALID_LICENSE", "License has expired")

        if lic.user_limits > 0 and current_user_count >= lic.user_limits:
            raise BusinessException("LIMIT_EXCEEDED", "Tenant user limit exceeded")
