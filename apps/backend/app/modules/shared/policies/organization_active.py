import uuid

from app.core.exceptions.base import BusinessException
from app.modules.admin.domains.organization.repositories.organization import (
    OrganizationRepository,
)


class OrganizationActivePolicy:
    def __init__(self, organization_repo: OrganizationRepository):
        self.organization_repo = organization_repo

    async def check(self, company_id: uuid.UUID) -> None:
        from app.modules.platform.domains.context_vars import bypass_tenant_context

        # Bypassing tenant context temporarily to read organization profile
        token = bypass_tenant_context.set(True)
        try:
            org = await self.organization_repo.get_by_id(company_id)
            if not org:
                raise BusinessException(
                    "ORGANIZATION_NOT_FOUND",
                    f"Organization {company_id} does not exist",
                )
            status = getattr(org, "status", "Active")
            if status != "Active":
                raise BusinessException(
                    "ORGANIZATION_INACTIVE", f"Organization {company_id} is inactive"
                )
        finally:
            bypass_tenant_context.reset(token)
