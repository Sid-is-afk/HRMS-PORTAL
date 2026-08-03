from typing import Any

from fastapi import APIRouter, Depends

from app.api.v1.dependencies.auth import get_current_user
from app.modules.admin.domains.leave.schemas.leave import (
    AdminLeaveDashboardSummary,
    AdminLeaveRequest,
)
from app.modules.auth.domains.users.models.user import User
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/admin/leave", tags=["Admin Leave"])


@router.get(
    "/dashboard/summary",
    response_model=SuccessResponse[AdminLeaveDashboardSummary],
)
async def get_leave_dashboard_summary(
    current_user: User = Depends(get_current_user),
) -> Any:
    summary = AdminLeaveDashboardSummary(
        totalRequests=18, pendingApproval=4, approvedToday=2, onLeaveToday=3
    )
    return SuccessResponse(data=summary)


@router.get("/requests", response_model=SuccessResponse[list[AdminLeaveRequest]])
async def get_leave_requests(
    current_user: User = Depends(get_current_user),
) -> Any:
    requests = [
        AdminLeaveRequest(
            id="leave-admin-1",
            employee_name="Aarav Patel",
            employee_id="EMP00001",
            department="Engineering",
            leave_type_name="Annual Leave",
            start_date="2026-08-01",
            end_date="2026-08-05",
            status="PENDING",
            reason="Family trip",
        ),
        AdminLeaveRequest(
            id="leave-admin-2",
            employee_name="Priya Sharma",
            employee_id="EMP00002",
            department="Marketing",
            leave_type_name="Sick Leave",
            start_date="2026-07-30",
            end_date="2026-07-31",
            status="APPROVED",
            reason="Fever",
        ),
        AdminLeaveRequest(
            id="leave-admin-3",
            employee_name="John Doe",
            employee_id="EMP00003",
            department="Sales",
            leave_type_name="Casual Leave",
            start_date="2026-08-10",
            end_date="2026-08-11",
            status="PENDING",
            reason="Personal work",
        ),
    ]
    return SuccessResponse(data=requests)
