from pydantic import BaseModel


class AdminLeaveDashboardSummary(BaseModel):
    totalRequests: int
    pendingApproval: int
    approvedToday: int
    onLeaveToday: int


class AdminLeaveRequest(BaseModel):
    id: str
    employee_name: str
    employee_id: str
    department: str
    leave_type_name: str
    start_date: str
    end_date: str
    status: str
    reason: str
