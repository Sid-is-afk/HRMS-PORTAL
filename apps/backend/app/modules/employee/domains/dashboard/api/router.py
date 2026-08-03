from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.employee.domains.dashboard.schemas.dashboard import (
    AnnouncementResponse,
    AttendanceSummary,
    DashboardSummaryResponse,
    HolidayResponse,
    LeaveBalanceSummary,
)
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/dashboard", tags=["Employee Dashboard"])


@router.get("/summary", response_model=SuccessResponse[DashboardSummaryResponse])
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    # Build default fallback data
    summary = DashboardSummaryResponse(
        attendance=AttendanceSummary(
            status="Present", checkIn="09:00 AM", checkOut="--:--"
        ),
        leaveBalance=LeaveBalanceSummary(annual=12, sick=5, casual=3),
    )
    return SuccessResponse(data=summary)


@router.get(
    "/announcements", response_model=SuccessResponse[list[AnnouncementResponse]]
)
async def get_announcements(
    current_user: User = Depends(get_current_user),
) -> Any:
    announcements = [
        AnnouncementResponse(
            id="1",
            title="Townhall Meeting",
            date="2026-10-25T10:00:00.000Z",
            type="Event",
        ),
        AnnouncementResponse(
            id="2",
            title="Office closed on Friday",
            date="2026-10-30T00:00:00.000Z",
            type="Holiday",
        ),
    ]
    return SuccessResponse(data=announcements)


@router.get("/holidays", response_model=SuccessResponse[list[HolidayResponse]])
async def get_upcoming_holidays(
    current_user: User = Depends(get_current_user),
) -> Any:
    holidays = [
        HolidayResponse(id="1", name="Diwali", date="2026-11-12"),
    ]
    return SuccessResponse(data=holidays)
