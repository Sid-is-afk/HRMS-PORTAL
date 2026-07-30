from pydantic import BaseModel


class AdminAttendanceDashboardSummary(BaseModel):
    presentPercentage: int
    absentCount: int
    lateCount: int
    onLeaveCount: int


class AdminAttendanceRecord(BaseModel):
    id: str
    employee_name: str
    employee_id: str
    department: str
    shift: str
    clock_in: str
    clock_out: str
    working_hours: str
    status: str
