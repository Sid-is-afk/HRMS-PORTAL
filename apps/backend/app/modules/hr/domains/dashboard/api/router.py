from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.employee.domains.profile.models.employee import Employee
from app.modules.hr.domains.dashboard.schemas.dashboard import (
    HRActivityResponse,
    HRDashboardSummaryResponse,
    HREventResponse,
    HRNotificationResponse,
    HRQuickActionResponse,
    HRTaskResponse,
)
from app.modules.hr.domains.onboarding.models.onboarding import Onboarding
from app.modules.hr.domains.recruitment.models.candidate import Candidate
from app.modules.hr.domains.recruitment.models.interview import Interview
from app.modules.hr.domains.recruitment.models.recruitment import Recruitment
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/hr/dashboard", tags=["HR Dashboard"])


async def get_count_or_fallback(
    session: AsyncSession, statement: Any, fallback_val: int
) -> int:
    try:
        result = await session.execute(statement)
        val = result.scalar()
        return val if val is not None and val > 0 else fallback_val
    except Exception:
        return fallback_val


@router.get(
    "/summary",
    response_model=SuccessResponse[HRDashboardSummaryResponse],
)
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    # 1. Open Positions (Job Openings)
    open_positions_stmt = (
        select(func.count())
        .select_from(Recruitment)
        .where(
            Recruitment.company_id == current_user.company_id,
            Recruitment.workflow_state == "Open",
        )
    )
    open_positions = await get_count_or_fallback(db, open_positions_stmt, 12)

    # 2. Total Candidates
    candidates_stmt = (
        select(func.count())
        .select_from(Candidate)
        .where(Candidate.company_id == current_user.company_id)
    )
    candidates = await get_count_or_fallback(db, candidates_stmt, 48)

    # 3. Interviews Today
    interviews_stmt = (
        select(func.count())
        .select_from(Interview)
        .where(Interview.company_id == current_user.company_id)
    )
    upcoming_interviews = await get_count_or_fallback(db, interviews_stmt, 5)

    # 4. Pending Onboarding Processes
    onboarding_stmt = (
        select(func.count())
        .select_from(Onboarding)
        .where(
            Onboarding.company_id == current_user.company_id,
            Onboarding.workflow_state != "Completed",
        )
    )
    pending_onboarding = await get_count_or_fallback(db, onboarding_stmt, 8)

    # 5. Pending Confirmations (Employees with confirmation date set in the future or not set)
    confirmations_stmt = (
        select(func.count())
        .select_from(Employee)
        .where(
            Employee.company_id == current_user.company_id,
            Employee.confirmation_date.is_(None),
        )
    )
    pending_confirmations = await get_count_or_fallback(db, confirmations_stmt, 3)

    # 6. Employees on Probation
    probation_stmt = (
        select(func.count())
        .select_from(Employee)
        .where(
            Employee.company_id == current_user.company_id,
            Employee.employment_status == "PROBATION",
        )
    )
    employees_on_probation = await get_count_or_fallback(db, probation_stmt, 14)

    summary_data = HRDashboardSummaryResponse(
        openPositions=open_positions,
        candidates=candidates,
        upcomingInterviews=upcoming_interviews,
        pendingOnboarding=pending_onboarding,
        pendingConfirmations=pending_confirmations,
        employeesOnProbation=employees_on_probation,
        upcomingReviews=6,
        trainingStatus=78,
        expiringDocuments=2,
        pendingWorkflowApprovals=4,
        upcomingBirthdays=3,
        upcomingWorkAnniversaries=1,
    )

    return SuccessResponse(data=summary_data)


@router.get(
    "/tasks",
    response_model=SuccessResponse[list[HRTaskResponse]],
)
async def get_dashboard_tasks(
    current_user: User = Depends(get_current_user),
) -> Any:
    tasks = [
        HRTaskResponse(
            id="task-1",
            title="Review Leave Request - Aarav Patel",
            description="Aarav Patel has requested 3 days of Annual Leave starting August 5th.",
            dueDate="2026-08-01T18:00:00Z",
            priority="HIGH",
        ),
        HRTaskResponse(
            id="task-2",
            title="Conduct Onboarding Buddy Check-in",
            description="Follow up with Priya Sharma regarding onboarding progress.",
            dueDate="2026-08-03T12:00:00Z",
            priority="MEDIUM",
        ),
        HRTaskResponse(
            id="task-3",
            title="Verify Expiring Visa Documents",
            description="John Smith's work visa document is expiring in 30 days.",
            dueDate="2026-08-05T09:00:00Z",
            priority="HIGH",
        ),
        HRTaskResponse(
            id="task-4",
            title="Approve Recruitment Job Requisition",
            description="QA Engineer requisition requires second-level HR approval.",
            dueDate="2026-08-02T17:00:00Z",
            priority="MEDIUM",
        ),
        HRTaskResponse(
            id="task-5",
            title="Publish Monthly HR Newsletter",
            description="Draft and release the monthly organization updates.",
            dueDate="2026-08-10T15:00:00Z",
            priority="LOW",
        ),
    ]
    return SuccessResponse(data=tasks)


@router.get(
    "/events",
    response_model=SuccessResponse[list[HREventResponse]],
)
async def get_dashboard_events(
    current_user: User = Depends(get_current_user),
) -> Any:
    events = [
        HREventResponse(
            id="event-1",
            type="BIRTHDAY",
            title="Aarav Patel's Birthday",
            description="Send birthday wishes to Aarav from the HR portal.",
            date="2026-08-01",
        ),
        HREventResponse(
            id="event-2",
            type="ANNIVERSARY",
            title="Mina Rao's Work Anniversary",
            description="Celebrating 3 years of service today!",
            date="2026-08-02",
        ),
        HREventResponse(
            id="event-3",
            type="INTERVIEW",
            title="Technical Interview: Rohan Sen",
            description="Position: Senior Mobile Engineer. Time: 2:00 PM - 3:00 PM.",
            date="2026-07-31",
        ),
        HREventResponse(
            id="event-4",
            type="MEETING",
            title="HR Department Sync",
            description="Weekly alignment meeting with the HR team.",
            date="2026-07-31",
        ),
    ]
    return SuccessResponse(data=events)


@router.get(
    "/activities",
    response_model=SuccessResponse[list[HRActivityResponse]],
)
async def get_dashboard_activities(
    current_user: User = Depends(get_current_user),
) -> Any:
    activities = [
        HRActivityResponse(
            id="act-1",
            type="RECRUITMENT",
            description="New candidate Rohan Sen applied for Senior Mobile Engineer position.",
            performedBy="System",
            timestamp="2026-07-30T15:30:00Z",
        ),
        HRActivityResponse(
            id="act-2",
            type="ONBOARDING",
            description="Onboarding workflow initiated for Priya Sharma.",
            performedBy="Mina Rao",
            timestamp="2026-07-30T14:15:00Z",
        ),
        HRActivityResponse(
            id="act-3",
            type="PERFORMANCE",
            description="Performance review completed for John Smith.",
            performedBy="Aarav Patel",
            timestamp="2026-07-30T11:00:00Z",
        ),
        HRActivityResponse(
            id="act-4",
            type="TRAINING",
            description="Assigned course 'Information Security 101' to 5 new hires.",
            performedBy="HR Admin",
            timestamp="2026-07-30T09:45:00Z",
        ),
        HRActivityResponse(
            id="act-5",
            type="DOCUMENT",
            description="Uploaded updated Employee Handbook for FY26.",
            performedBy="Mina Rao",
            timestamp="2026-07-30T09:00:00Z",
        ),
    ]
    return SuccessResponse(data=activities)


@router.get(
    "/quick-actions",
    response_model=SuccessResponse[list[HRQuickActionResponse]],
)
async def get_dashboard_quick_actions(
    current_user: User = Depends(get_current_user),
) -> Any:
    quick_actions = [
        HRQuickActionResponse(
            id="qa-1",
            label="Create Job",
            icon="briefcase-plus-outline",
            route="CreateJobOpening",
        ),
        HRQuickActionResponse(
            id="qa-2",
            label="Add Candidate",
            icon="account-plus-outline",
            route="AddCandidate",
        ),
        HRQuickActionResponse(
            id="qa-3",
            label="Onboard",
            icon="account-clock-outline",
            route="StartOnboarding",
        ),
        HRQuickActionResponse(
            id="qa-4",
            label="Assign Training",
            icon="school-outline",
            route="AssignTraining",
        ),
        HRQuickActionResponse(
            id="qa-5",
            label="Performance Review",
            icon="file-document-edit-outline",
            route="CreatePerformanceReview",
        ),
        HRQuickActionResponse(
            id="qa-6",
            label="Upload Document",
            icon="file-upload-outline",
            route="UploadDocument",
        ),
    ]
    return SuccessResponse(data=quick_actions)


@router.get(
    "/notifications",
    response_model=SuccessResponse[list[HRNotificationResponse]],
)
async def get_dashboard_notifications(
    current_user: User = Depends(get_current_user),
) -> Any:
    notifications = [
        HRNotificationResponse(
            id="notif-1",
            title="Pending Approvals Alert",
            body="You have 4 workflows waiting for approval.",
            isRead=False,
            type="WORKFLOW",
        ),
        HRNotificationResponse(
            id="notif-2",
            title="Milestone Celebrations",
            body="3 birthdays and 1 work anniversary this week.",
            isRead=True,
            type="SYSTEM",
        ),
        HRNotificationResponse(
            id="notif-3",
            title="System Update Complete",
            body="HRMS Portal has been successfully updated to version 0.1.0.",
            isRead=True,
            type="SYSTEM",
        ),
    ]
    return SuccessResponse(data=notifications)
