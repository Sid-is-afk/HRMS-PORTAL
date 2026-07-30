from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.admin.domains.attendance.schemas.attendance import (
    AdminAttendanceDashboardSummary,
    AdminAttendanceRecord,
)
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/admin/attendance", tags=["Admin Attendance"])


@router.get(
    "/dashboard/summary",
    response_model=SuccessResponse[AdminAttendanceDashboardSummary],
)
async def get_attendance_dashboard_summary(
    current_user: User = Depends(get_current_user),
) -> Any:
    summary = AdminAttendanceDashboardSummary(
        presentPercentage=92, absentCount=5, lateCount=2, onLeaveCount=3
    )
    return SuccessResponse(data=summary)


@router.get("", response_model=SuccessResponse[list[AdminAttendanceRecord]])
async def get_attendance_records(
    current_user: User = Depends(get_current_user),
) -> Any:
    records = [
        AdminAttendanceRecord(
            id="att-admin-1",
            employee_name="Aarav Patel",
            employee_id="EMP00001",
            department="Engineering",
            shift="General (09:00 - 18:00)",
            clock_in="09:05 AM",
            clock_out="05:15 PM",
            working_hours="8.17 hrs",
            status="PRESENT",
        ),
        AdminAttendanceRecord(
            id="att-admin-2",
            employee_name="Priya Sharma",
            employee_id="EMP00002",
            department="Marketing",
            shift="General (09:00 - 18:00)",
            clock_in="09:45 AM",
            clock_out="06:00 PM",
            working_hours="8.25 hrs",
            status="LATE",
        ),
        AdminAttendanceRecord(
            id="att-admin-3",
            employee_name="John Doe",
            employee_id="EMP00003",
            department="Sales",
            shift="General (09:00 - 18:00)",
            clock_in="--:--",
            clock_out="--:--",
            working_hours="0.00 hrs",
            status="ABSENT",
        ),
        AdminAttendanceRecord(
            id="att-admin-4",
            employee_name="Jane Smith",
            employee_id="EMP00004",
            department="Engineering",
            shift="General (09:00 - 18:00)",
            clock_in="--:--",
            clock_out="--:--",
            working_hours="0.00 hrs",
            status="LEAVE",
        ),
    ]
    return SuccessResponse(data=records)
