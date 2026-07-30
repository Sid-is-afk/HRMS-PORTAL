from pydantic import BaseModel


class AttendanceSummary(BaseModel):
    status: str
    checkIn: str | None = None
    checkOut: str | None = None


class LeaveBalanceSummary(BaseModel):
    annual: int
    sick: int
    casual: int


class DashboardSummaryResponse(BaseModel):
    attendance: AttendanceSummary
    leaveBalance: LeaveBalanceSummary


class AnnouncementResponse(BaseModel):
    id: str
    title: str
    date: str
    type: str


class HolidayResponse(BaseModel):
    id: str
    name: str
    date: str
