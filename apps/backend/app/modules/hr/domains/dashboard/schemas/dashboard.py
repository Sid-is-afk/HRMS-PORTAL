from pydantic import BaseModel


class HRDashboardSummaryResponse(BaseModel):
    openPositions: int
    candidates: int
    upcomingInterviews: int
    pendingOnboarding: int
    pendingConfirmations: int
    employeesOnProbation: int
    upcomingReviews: int
    trainingStatus: int
    expiringDocuments: int
    pendingWorkflowApprovals: int
    upcomingBirthdays: int
    upcomingWorkAnniversaries: int


class HRTaskResponse(BaseModel):
    id: str
    title: str
    description: str
    dueDate: str
    priority: str


class HREventResponse(BaseModel):
    id: str
    type: str
    title: str
    description: str
    date: str


class HRActivityResponse(BaseModel):
    id: str
    type: str
    description: str
    performedBy: str
    timestamp: str


class HRQuickActionResponse(BaseModel):
    id: str
    label: str
    icon: str
    route: str


class HRNotificationResponse(BaseModel):
    id: str
    title: str
    body: str
    isRead: bool
    type: str
