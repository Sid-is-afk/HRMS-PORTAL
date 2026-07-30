from typing import Any

from fastapi import APIRouter, Depends

from app.api.v1.dependencies.auth import get_current_user
from app.modules.auth.domains.users.models.user import User
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
            PlatformHealthService(
                name="Core API", status="Healthy", latency="42ms"
            ),
            PlatformHealthService(
                name="Authentication", status="Healthy", latency="24ms"
            ),
            PlatformHealthService(
                name="Background Workers", status="Healthy", latency="150ms"
            ),
            PlatformHealthService(
                name="Database", status="Healthy", latency="8ms"
            ),
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
