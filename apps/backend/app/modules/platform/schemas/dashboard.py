from pydantic import BaseModel


class PlatformHealthService(BaseModel):
    name: str
    status: str
    latency: str


class PlatformPendingAction(BaseModel):
    id: str
    label: str
    count: int
    iconName: str
    bg: str
    color: str


class PlatformMetricItem(BaseModel):
    date: str | None = None
    name: str | None = None
    value: int


class PlatformDashboardSummaryResponse(BaseModel):
    totalOrganizations: int
    platformUsers: int
    systemHealth: str
    apiHealth: str
    healthServices: list[PlatformHealthService]
    pendingActions: list[PlatformPendingAction]
    orgGrowth: list[PlatformMetricItem]
    userDistribution: list[PlatformMetricItem]
    apiUsage: list[PlatformMetricItem]


class PlatformActivityResponse(BaseModel):
    id: str
    description: str
    timestamp: str
    type: str


class PlatformNotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    read: bool
    createdAt: str
