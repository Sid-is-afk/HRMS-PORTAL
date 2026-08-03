import uuid
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from datetime import date, datetime

from sqlalchemy import select

from app.core.exceptions.base import BusinessException
from app.core.security.hashing import get_password_hash
from app.events.publishers.platform import publish_platform_event
from app.modules.admin.domains.organization.models.organization import Organization
from app.modules.admin.domains.organization.repositories.organization import (
    OrganizationRepository,
)
from app.modules.admin.domains.organization.schemas.schemas import (
    OrganizationCreateRequest,
)
from app.modules.auth.domains.identity.models.identity import Identity
from app.modules.auth.domains.permissions.models.permission import Permission
from app.modules.auth.domains.permissions.repositories.permission import (
    PermissionRepository,
)
from app.modules.auth.domains.roles.models.role import Role, user_roles
from app.modules.auth.domains.roles.repositories.role import RoleRepository
from app.modules.auth.domains.users.models.user import User
from app.modules.platform.domains.configuration.models.configuration import (
    PlatformConfiguration,
)
from app.modules.platform.domains.configuration.repositories.configuration import (
    ConfigurationRepository,
)
from app.modules.platform.domains.context_vars import bypass_tenant_context
from app.modules.platform.domains.events import (
    AdminIdentityCreated,
    DefaultRolesSeeded,
    ModulesEnabled,
    OrganizationCreated,
    ProvisioningCompleted,
    TenantProvisioningStarted,
    TenantValidated,
)
from app.modules.platform.domains.provisioning.models.provisioning import (
    ProvisioningHistory,
    ProvisioningJob,
)
from app.modules.platform.domains.provisioning.repositories.provisioning import (
    ProvisioningRepository,
)
from app.modules.platform.domains.tenant.models.tenant import Tenant
from app.modules.platform.domains.tenant.repositories.tenant import TenantRepository


@asynccontextmanager
async def bypass_tenant() -> AsyncGenerator[None]:
    token = bypass_tenant_context.set(True)
    try:
        yield
    finally:
        bypass_tenant_context.reset(token)


class ProvisioningService:
    def __init__(
        self,
        provision_repo: ProvisioningRepository,
        tenant_repo: TenantRepository,
        org_repo: OrganizationRepository,
        role_repo: RoleRepository,
        perm_repo: PermissionRepository,
        config_repo: ConfigurationRepository,
    ):
        self.provision_repo = provision_repo
        self.tenant_repo = tenant_repo
        self.org_repo = org_repo
        self.role_repo = role_repo
        self.perm_repo = perm_repo
        self.config_repo = config_repo

    async def get_job(self, job_id: uuid.UUID) -> ProvisioningJob:
        job = await self.provision_repo.get_by_id(job_id)
        if not job:
            raise BusinessException("ENTITY_NOT_FOUND", "Provisioning job not found")
        return job

    async def start_provisioning(self, tenant_id: uuid.UUID) -> ProvisioningJob:
        async with bypass_tenant():
            tenant = await self.tenant_repo.get_by_id(tenant_id)
            if not tenant:
                raise BusinessException("ENTITY_NOT_FOUND", "Tenant not found")

            # Check if active job exists
            job = await self.provision_repo.get_active_job_by_tenant_id(tenant_id)
            if not job:
                job = ProvisioningJob(
                    tenant_id=tenant_id,
                    status="InProgress",
                    current_step="Tenant Requested",
                    retry_count=0,
                )
                job = await self.provision_repo.create(job)
            else:
                if job.status == "Completed":
                    return job
                job.status = "InProgress"
                job.retry_count += 1
                job = await self.provision_repo.create(job)

            # Start execution loop
            try:
                await self._execute_workflow(job, tenant)
            except Exception as e:
                job.status = "Failed"
                job.error_message = str(e)[:250]
                await self.provision_repo.create(job)
                raise BusinessException(
                    "PROVISIONING_FAILED", f"Provisioning failed: {str(e)}"
                )

            return job

    async def _execute_workflow(self, job: ProvisioningJob, tenant: Tenant) -> None:
        steps = [
            "Tenant Requested",
            "Tenant Validated",
            "Organization Created",
            "Default Roles Seeded",
            "Default Permissions Seeded",
            "Admin Identity Created",
            "Default Configuration Created",
            "Modules Enabled",
            "Provisioning Completed",
        ]

        # Fetch already completed steps for this job
        histories = await self.provision_repo.get_histories_by_job_id(job.id)
        completed_steps = {h.step for h in histories if h.status == "Success"}

        for step in steps:
            if step in completed_steps:
                continue

            job.current_step = step
            await self.provision_repo.create(job)

            try:
                await self._run_step(step, job, tenant)

                # Log success history
                history = ProvisioningHistory(
                    job_id=job.id, step=step, status="Success"
                )
                await self.provision_repo.create_history(history)
            except Exception as e:
                # Log failure history
                history = ProvisioningHistory(
                    job_id=job.id,
                    step=step,
                    status="Failed",
                    error_message=str(e)[:250],
                )
                await self.provision_repo.create_history(history)
                raise e

    async def _run_step(self, step: str, job: ProvisioningJob, tenant: Tenant) -> None:
        tenant_id = tenant.id

        if step == "Tenant Requested":
            await publish_platform_event(
                TenantProvisioningStarted(
                    tenant_id=tenant_id, payload={"job_id": str(job.id)}
                )
            )

        elif step == "Tenant Validated":
            if tenant.status != "Active":
                raise ValueError("Tenant is not active")
            await publish_platform_event(
                TenantValidated(
                    tenant_id=tenant_id, payload={"validated_at": str(datetime.now())}
                )
            )

        elif step == "Organization Created":
            # Call organization creation service payload
            org_payload = OrganizationCreateRequest(
                name=tenant.tenant_name,
                code=tenant.tenant_code.upper(),
                org_type="Company",
                effective_from=date.today(),
                status="ACTIVE",
            )
            # Create organization in Admin module
            org = Organization(
                company_id=tenant_id,
                name=org_payload.name,
                code=org_payload.code,
                org_type=org_payload.org_type,
                effective_from=org_payload.effective_from,
                is_active=True,
            )
            created_org = await self.org_repo.create(org)
            tenant.organization_id = created_org.id
            await self.tenant_repo.create(tenant)

            await publish_platform_event(
                OrganizationCreated(
                    tenant_id=tenant_id,
                    payload={"organization_id": str(created_org.id)},
                )
            )

        elif step == "Default Roles Seeded":
            roles = ["Tenant Admin", "HR Manager", "Employee"]
            for r_name in roles:
                dup_role = await self.role_repo.get_by_name(r_name)
                if not dup_role:
                    role = Role(name=r_name, description=f"Default {r_name} role")
                    await self.role_repo.create(role)
            await publish_platform_event(
                DefaultRolesSeeded(
                    tenant_id=tenant_id, payload={"roles_count": len(roles)}
                )
            )

        elif step == "Default Permissions Seeded":
            perms = ["tenant:read", "tenant:update", "employee:read", "hr:read"]
            for p_name in perms:
                # Direct check
                stmt = select(Permission).where(Permission.name == p_name)
                res = await self.org_repo.session.execute(stmt)
                dup_perm = res.scalars().first()
                if not dup_perm:
                    perm = Permission(
                        name=p_name, description=f"Default {p_name} permission"
                    )
                    await self.perm_repo.create(perm)

        elif step == "Admin Identity Created":
            # Check duplicate admin identity
            email = f"admin@{tenant.tenant_code.lower()}.com"
            ident_stmt = select(Identity).where(Identity.email == email)
            res = await self.org_repo.session.execute(ident_stmt)
            dup_ident = res.scalars().first()

            if not dup_ident:
                identity = Identity(
                    email=email,
                    password_hash=get_password_hash("adminPassword123"),
                    account_status="Active",
                    email_verified=True,
                )
                self.org_repo.session.add(identity)
                await self.org_repo.session.flush()

                user = User(
                    identity_id=identity.id,
                    company_id=tenant_id,
                    display_name=f"Admin for {tenant.tenant_name}",
                )
                self.org_repo.session.add(user)
                await self.org_repo.session.flush()

                # Assign role
                admin_role = await self.role_repo.get_by_name("Tenant Admin")
                if admin_role:
                    await self.org_repo.session.execute(
                        user_roles.insert().values(
                            user_id=user.id, role_id=admin_role.id
                        )
                    )

                await publish_platform_event(
                    AdminIdentityCreated(
                        tenant_id=tenant_id,
                        payload={"identity_id": str(identity.id), "email": email},
                    )
                )

        elif step == "Default Configuration Created":
            default_configs = {"theme": "dark", "language": "en", "timezone": "UTC"}
            for k, v in default_configs.items():
                config = PlatformConfiguration(
                    tenant_id=tenant_id, key=k, value=v, is_global=False
                )
                await self.config_repo.create(config)

        elif step == "Modules Enabled":
            await publish_platform_event(
                ModulesEnabled(
                    tenant_id=tenant_id,
                    payload={"modules": ["Admin", "Employee", "HR"]},
                )
            )

        elif step == "Provisioning Completed":
            tenant.provisioning_status = "Completed"
            await self.tenant_repo.create(tenant)

            job.status = "Completed"
            await self.provision_repo.create(job)

            await publish_platform_event(
                ProvisioningCompleted(
                    tenant_id=tenant_id, payload={"completed_at": str(datetime.now())}
                )
            )
