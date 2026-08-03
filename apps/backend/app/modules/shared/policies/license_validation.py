import uuid
from datetime import datetime

from app.core.exceptions.base import BusinessException
from app.modules.platform.domains.licensing.repositories.license import (
    LicenseRepository,
)


class LicenseValidationPolicy:
    def __init__(self, license_repo: LicenseRepository):
        self.license_repo = license_repo

    async def check(self, tenant_id: uuid.UUID) -> None:
        from app.modules.platform.domains.context_vars import bypass_tenant_context

        token = bypass_tenant_context.set(True)
        try:
            lic = await self.license_repo.get_active_by_tenant_id(tenant_id)
            if not lic:
                raise BusinessException(
                    "NO_ACTIVE_LICENSE", f"Tenant {tenant_id} has no active license"
                )
            if lic.expires_at and lic.expires_at < datetime.now():
                raise BusinessException(
                    "LICENSE_EXPIRED", f"License for tenant {tenant_id} has expired"
                )
        finally:
            bypass_tenant_context.reset(token)
