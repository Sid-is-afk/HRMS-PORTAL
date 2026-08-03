import uuid

from app.core.exceptions.base import BusinessException
from app.modules.platform.domains.tenant.repositories.tenant import TenantRepository


class ActiveTenantPolicy:
    def __init__(self, tenant_repo: TenantRepository):
        self.tenant_repo = tenant_repo

    async def check(self, tenant_id: uuid.UUID) -> None:
        from app.modules.platform.domains.context_vars import bypass_tenant_context

        token = bypass_tenant_context.set(True)
        try:
            tenant = await self.tenant_repo.get_by_id(tenant_id)
            if not tenant:
                raise BusinessException(
                    "TENANT_NOT_FOUND", f"Tenant {tenant_id} does not exist"
                )
            if tenant.status != "Active":
                raise BusinessException(
                    "TENANT_INACTIVE",
                    f"Tenant {tenant_id} is inactive (status: {tenant.status})",
                )
        finally:
            bypass_tenant_context.reset(token)
