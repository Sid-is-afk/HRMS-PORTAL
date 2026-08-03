import uuid
from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.core.middleware.idempotency import IdempotencyChecker
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.platform.domains.configuration.repositories.configuration import (
    ConfigurationRepository,
)
from app.modules.platform.domains.configuration.schemas.configuration import (
    ConfigurationResponse,
    ConfigurationUpdateRequest,
)
from app.modules.platform.domains.configuration.services.configuration import (
    ConfigurationService,
)
from app.modules.platform.domains.feature_flags.repositories.feature_flag import (
    FeatureRepository,
)
from app.modules.platform.domains.feature_flags.schemas.feature_flag import (
    FeatureFlagResponse,
    FeatureFlagUpdateRequest,
)
from app.modules.platform.domains.feature_flags.services.feature_flag import (
    FeatureFlagService,
)
from app.modules.platform.domains.licensing.repositories.license import (
    LicenseRepository,
)
from app.modules.platform.domains.licensing.schemas.license import (
    LicenseCreateRequest,
    LicenseResponse,
)
from app.modules.platform.domains.licensing.services.license import LicenseService
from app.modules.platform.domains.provisioning.repositories.provisioning import (
    ProvisioningRepository,
)
from app.modules.platform.domains.provisioning.schemas.provisioning import (
    ProvisioningJobResponse,
    ProvisionRequest,
)
from app.modules.platform.domains.provisioning.services.provisioning import (
    ProvisioningService,
)

# Imports of models, repos, services, and schemas
from app.modules.platform.domains.tenant.repositories.tenant import TenantRepository
from app.modules.platform.domains.tenant.schemas.tenant import (
    TenantCreateRequest,
    TenantResponse,
    TenantUpdateRequest,
)
from app.modules.platform.domains.tenant.services.tenant import TenantService

# Dashboard schemas
from app.modules.platform.schemas.dashboard import (
    PlatformActivityResponse,
    PlatformDashboardSummaryResponse,
    PlatformHealthService,
    PlatformMetricItem,
    PlatformNotificationResponse,
    PlatformPendingAction,
)
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/platform", tags=["Platform Admin"])


# Dependency injection helpers
def get_tenant_service(db: AsyncSession = Depends(get_db)) -> TenantService:
    repo = TenantRepository(db)
    prov_repo = ProvisioningRepository(db)
    from app.modules.admin.domains.organization.repositories.organization import (
        OrganizationRepository,
    )
    from app.modules.auth.domains.permissions.repositories.permission import (
        PermissionRepository,
    )
    from app.modules.auth.domains.roles.repositories.role import RoleRepository

    org_repo = OrganizationRepository(db)
    role_repo = RoleRepository(db)
    perm_repo = PermissionRepository(db)
    config_repo = ConfigurationRepository(db)

    prov_service = ProvisioningService(
        prov_repo, repo, org_repo, role_repo, perm_repo, config_repo
    )
    return TenantService(repo, prov_service)


def get_provisioning_service(db: AsyncSession = Depends(get_db)) -> ProvisioningService:
    prov_repo = ProvisioningRepository(db)
    tenant_repo = TenantRepository(db)
    from app.modules.admin.domains.organization.repositories.organization import (
        OrganizationRepository,
    )
    from app.modules.auth.domains.permissions.repositories.permission import (
        PermissionRepository,
    )
    from app.modules.auth.domains.roles.repositories.role import RoleRepository

    org_repo = OrganizationRepository(db)
    role_repo = RoleRepository(db)
    perm_repo = PermissionRepository(db)
    config_repo = ConfigurationRepository(db)

    return ProvisioningService(
        prov_repo, tenant_repo, org_repo, role_repo, perm_repo, config_repo
    )


def get_license_service(db: AsyncSession = Depends(get_db)) -> LicenseService:
    repo = LicenseRepository(db)
    return LicenseService(repo)


def get_feature_service(db: AsyncSession = Depends(get_db)) -> FeatureFlagService:
    repo = FeatureRepository(db)
    return FeatureFlagService(repo)


def get_config_service(db: AsyncSession = Depends(get_db)) -> ConfigurationService:
    repo = ConfigurationRepository(db)
    return ConfigurationService(repo)


# --- Tenant Routes ---
@router.get(
    "/tenants",
    response_model=SuccessResponse[list[TenantResponse]],
    dependencies=[Depends(PermissionGuard("tenant:read"))],
)
async def list_tenants(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    provisioning_status: str | None = None,
    subscription_plan: str | None = None,
    license_id: uuid.UUID | None = None,
    status: str | None = None,
    sort_by: str | None = None,
    sort_order: str = "asc",
    service: TenantService = Depends(get_tenant_service),
) -> Any:
    entities, count = await service.repo.get_paginated(
        page=page,
        size=size,
        search=search,
        provisioning_status=provisioning_status,
        subscription_plan=subscription_plan,
        license_id=license_id,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return SuccessResponse(
        data=entities, metadata={"total": count, "page": page, "size": size}
    )


@router.get(
    "/tenants/{id}",
    response_model=SuccessResponse[TenantResponse],
    dependencies=[Depends(PermissionGuard("tenant:read"))],
)
async def get_tenant(
    id: uuid.UUID,
    service: TenantService = Depends(get_tenant_service),
) -> Any:
    tenant = await service.get_by_id(id)
    return SuccessResponse(data=tenant)


@router.post(
    "/tenants",
    response_model=SuccessResponse[TenantResponse],
    status_code=201,
    dependencies=[
        Depends(PermissionGuard("tenant:create")),
        Depends(IdempotencyChecker()),
    ],
)
async def create_tenant(
    payload: TenantCreateRequest,
    service: TenantService = Depends(get_tenant_service),
) -> Any:
    tenant = await service.create_tenant(payload)
    return SuccessResponse(data=tenant)


@router.put(
    "/tenants/{id}",
    response_model=SuccessResponse[TenantResponse],
    dependencies=[Depends(PermissionGuard("tenant:update"))],
)
async def update_tenant(
    id: uuid.UUID,
    payload: TenantUpdateRequest,
    service: TenantService = Depends(get_tenant_service),
) -> Any:
    tenant = await service.update_tenant(id, payload)
    return SuccessResponse(data=tenant)


@router.patch(
    "/tenants/{id}/status",
    response_model=SuccessResponse[TenantResponse],
    dependencies=[Depends(PermissionGuard("tenant:update"))],
)
async def update_tenant_status(
    id: uuid.UUID,
    status: str = Query(...),
    reason: str | None = Query(None),
    service: TenantService = Depends(get_tenant_service),
) -> Any:
    tenant = await service.update_status(id, status, reason)
    return SuccessResponse(data=tenant)


# --- Provisioning Routes ---
@router.post(
    "/provision",
    response_model=SuccessResponse[ProvisioningJobResponse],
    dependencies=[
        Depends(PermissionGuard("platform:admin")),
        Depends(IdempotencyChecker()),
    ],
)
async def provision_tenant(
    payload: ProvisionRequest,
    service: ProvisioningService = Depends(get_provisioning_service),
) -> Any:
    job = await service.start_provisioning(payload.tenant_id)
    # Load histories manually to return full job trace
    histories = await service.provision_repo.get_histories_by_job_id(job.id)
    job.histories = histories
    return SuccessResponse(data=job)


# --- Licensing Routes ---
@router.get(
    "/licenses",
    response_model=SuccessResponse[LicenseResponse | None],
    dependencies=[Depends(PermissionGuard("license:manage"))],
)
async def get_active_license(
    tenant_id: uuid.UUID = Query(...),
    service: LicenseService = Depends(get_license_service),
) -> Any:
    lic = await service.get_active_license(tenant_id)
    return SuccessResponse(data=lic)


@router.post(
    "/licenses",
    response_model=SuccessResponse[LicenseResponse],
    dependencies=[Depends(PermissionGuard("license:manage"))],
)
async def create_license(
    payload: LicenseCreateRequest,
    current_user: User = Depends(get_current_user),
    service: LicenseService = Depends(get_license_service),
) -> Any:
    lic = await service.create_license(current_user.company_id, payload)
    return SuccessResponse(data=lic)


# --- Feature Flags Routes ---
@router.get(
    "/features",
    response_model=SuccessResponse[list[FeatureFlagResponse]],
    dependencies=[Depends(PermissionGuard("feature:manage"))],
)
async def list_features(
    tenant_id: uuid.UUID | None = Query(None),
    service: FeatureFlagService = Depends(get_feature_service),
) -> Any:
    if tenant_id:
        flags = await service.repo.get_tenant_flags(tenant_id)
    else:
        flags = await service.repo.get_global_flags()
    return SuccessResponse(data=flags)


@router.patch(
    "/features",
    response_model=SuccessResponse[FeatureFlagResponse],
    dependencies=[Depends(PermissionGuard("feature:manage"))],
)
async def update_feature_flag(
    payload: FeatureFlagUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: FeatureFlagService = Depends(get_feature_service),
) -> Any:
    flag = await service.update_flag(current_user.company_id, payload)
    return SuccessResponse(data=flag)


# --- Configuration Routes ---
@router.get(
    "/configuration",
    response_model=SuccessResponse[list[ConfigurationResponse]],
    dependencies=[Depends(PermissionGuard("configuration:update"))],
)
async def list_configurations(
    tenant_id: uuid.UUID | None = Query(None),
    service: ConfigurationService = Depends(get_config_service),
) -> Any:
    if tenant_id:
        configs = await service.repo.get_tenant_configurations(tenant_id)
    else:
        configs = await service.repo.get_global_configurations()
    return SuccessResponse(data=configs)


@router.put(
    "/configuration",
    response_model=SuccessResponse[ConfigurationResponse],
    dependencies=[Depends(PermissionGuard("configuration:update"))],
)
async def update_configuration(
    payload: ConfigurationUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: ConfigurationService = Depends(get_config_service),
) -> Any:
    config = await service.update_value(current_user.company_id, payload)
    return SuccessResponse(data=config)


# --- Existing Dashboard Summary Endpoints ---
@router.get(
    "/dashboard/summary",
    response_model=SuccessResponse[PlatformDashboardSummaryResponse],
)
async def get_platform_dashboard_summary(
    current_user: User = Depends(get_current_user),
) -> Any:
    summary = PlatformDashboardSummaryResponse(
        totalOrganizations=15,
        platformUsers=340,
        systemHealth="Healthy",
        apiHealth="Healthy",
        healthServices=[
            PlatformHealthService(name="Core API", status="Healthy", latency="42ms"),
            PlatformHealthService(
                name="Authentication", status="Healthy", latency="24ms"
            ),
            PlatformHealthService(
                name="Background Workers", status="Healthy", latency="150ms"
            ),
            PlatformHealthService(name="Database", status="Healthy", latency="8ms"),
        ],
        pendingActions=[
            PlatformPendingAction(
                id="1",
                label="Review Tenant Request",
                count=1,
                iconName="Building2",
                bg="#EFF6FF",
                color="#2563EB",
            ),
            PlatformPendingAction(
                id="2",
                label="SSL Expiry Warning",
                count=1,
                iconName="ShieldAlert",
                bg="#FEF3C7",
                color="#D97706",
            ),
        ],
        orgGrowth=[
            PlatformMetricItem(date="Jan", value=8),
            PlatformMetricItem(date="Feb", value=10),
            PlatformMetricItem(date="Mar", value=12),
            PlatformMetricItem(date="Apr", value=15),
        ],
        userDistribution=[
            PlatformMetricItem(name="Admin", value=30),
            PlatformMetricItem(name="Employee", value=290),
            PlatformMetricItem(name="HR", value=20),
        ],
        apiUsage=[
            PlatformMetricItem(name="Mon", value=2400),
            PlatformMetricItem(name="Tue", value=1398),
            PlatformMetricItem(name="Wed", value=9800),
            PlatformMetricItem(name="Thu", value=3908),
            PlatformMetricItem(name="Fri", value=4800),
        ],
    )
    return SuccessResponse(data=summary)


@router.get(
    "/dashboard/activities",
    response_model=SuccessResponse[list[PlatformActivityResponse]],
)
async def get_platform_activities(
    current_user: User = Depends(get_current_user),
) -> Any:
    activities = [
        PlatformActivityResponse(
            id="act-1",
            description='New organization "Globex Corp" provisioned successfully',
            timestamp="10 mins ago",
            type="provision",
        ),
        PlatformActivityResponse(
            id="act-2",
            description="System backup completed successfully",
            timestamp="1 hour ago",
            type="backup",
        ),
        PlatformActivityResponse(
            id="act-3",
            description="Admin password changed for aarav.patel@company.com",
            timestamp="2 hours ago",
            type="security",
        ),
    ]
    return SuccessResponse(data=activities)


@router.get(
    "/dashboard/notifications",
    response_model=SuccessResponse[list[PlatformNotificationResponse]],
)
async def get_platform_notifications(
    current_user: User = Depends(get_current_user),
) -> Any:
    notifications = [
        PlatformNotificationResponse(
            id="not-1",
            title="New Tenant Provisioned",
            message="Globex Corp is now active.",
            read=False,
            createdAt="10 mins ago",
        ),
        PlatformNotificationResponse(
            id="not-2",
            title="High API Latency Alert",
            message="Core API latency exceeded 500ms.",
            read=True,
            createdAt="3 hours ago",
        ),
    ]
    return SuccessResponse(data=notifications)
