import uuid
from typing import TYPE_CHECKING

from app.core.exceptions.base import BusinessException
from app.events.publishers.platform import publish_platform_event
from app.modules.platform.domains.events import (
    TenantActivated,
    TenantCreated,
    TenantSuspended,
)
from app.modules.platform.domains.tenant.models.tenant import Tenant
from app.modules.platform.domains.tenant.repositories.tenant import TenantRepository
from app.modules.platform.domains.tenant.schemas.tenant import (
    TenantCreateRequest,
    TenantUpdateRequest,
)

if TYPE_CHECKING:
    from app.modules.platform.domains.provisioning.services.provisioning import (
        ProvisioningService,
    )


class TenantService:
    def __init__(
        self,
        repo: TenantRepository,
        provisioning_service: "ProvisioningService | None" = None,
    ):
        self.repo = repo
        self.provisioning_service = provisioning_service

    async def get_by_id(self, tenant_id: uuid.UUID) -> Tenant:
        tenant = await self.repo.get_by_id(tenant_id)
        if not tenant or tenant.deleted_at is not None:
            raise BusinessException("ENTITY_NOT_FOUND", "Tenant not found")
        return tenant

    async def create_tenant(self, payload: TenantCreateRequest) -> Tenant:
        # Check duplicate code
        dup_code = await self.repo.get_by_code(payload.tenant_code)
        if dup_code:
            raise BusinessException(
                "DUPLICATE_TENANT_CODE",
                f"Tenant code '{payload.tenant_code}' already exists",
            )

        # Check duplicate name
        dup_name = await self.repo.get_by_name(payload.tenant_name)
        if dup_name:
            raise BusinessException(
                "DUPLICATE_TENANT_NAME",
                f"Tenant name '{payload.tenant_name}' already exists",
            )

        tenant = Tenant(
            tenant_code=payload.tenant_code,
            tenant_name=payload.tenant_name,
            status="Active",
            subscription_plan=payload.subscription_plan,
            provisioning_status="Pending",
        )
        saved = await self.repo.create(tenant)

        # Publish event
        await publish_platform_event(
            TenantCreated(
                tenant_id=saved.id,
                payload={
                    "tenant_code": saved.tenant_code,
                    "tenant_name": saved.tenant_name,
                    "subscription_plan": saved.subscription_plan,
                },
            )
        )

        # Start provisioning job
        if self.provisioning_service:
            await self.provisioning_service.start_provisioning(saved.id)

        return saved

    async def update_tenant(
        self, tenant_id: uuid.UUID, payload: TenantUpdateRequest
    ) -> Tenant:
        tenant = await self.get_by_id(tenant_id)
        if payload.tenant_name is not None:
            tenant.tenant_name = payload.tenant_name
        if payload.subscription_plan is not None:
            tenant.subscription_plan = payload.subscription_plan
        return await self.repo.create(tenant)

    async def update_status(
        self, tenant_id: uuid.UUID, status: str, reason: str | None = None
    ) -> Tenant:
        tenant = await self.get_by_id(tenant_id)
        if status not in ["Active", "Suspended", "Inactive"]:
            raise BusinessException("VALIDATION_ERROR", f"Invalid status '{status}'")

        old_status = tenant.status
        tenant.status = status
        saved = await self.repo.create(tenant)

        if status == "Suspended":
            await publish_platform_event(
                TenantSuspended(
                    tenant_id=saved.id,
                    payload={
                        "reason": reason or "No reason provided",
                        "previous_status": old_status,
                    },
                )
            )
        elif status == "Active":
            await publish_platform_event(
                TenantActivated(
                    tenant_id=saved.id, payload={"previous_status": old_status}
                )
            )

        return saved
