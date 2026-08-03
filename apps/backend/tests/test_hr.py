import uuid
from datetime import UTC, date, datetime, time, timedelta

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions.base import BusinessException
from app.core.security.hashing import get_password_hash
from app.core.security.jwt import create_access_token
from app.modules.auth.domains.identity.models.identity import Identity
from app.modules.auth.domains.permissions.models.permission import Permission
from app.modules.auth.domains.roles.models.role import (
    Role,
    role_permissions,
    user_roles,
)
from app.modules.auth.domains.sessions.models.session import Session
from app.modules.auth.domains.users.models.user import User

# Repositories
from app.modules.hr.domains.attendance.repositories.attendance import (
    AttendanceRepository,
)

# Schemas
from app.modules.hr.domains.attendance.schemas.attendance import AttendanceCreateRequest

# Services
from app.modules.hr.domains.attendance.services.attendance import AttendanceService
from app.modules.hr.domains.leave.repositories.leave import LeaveRepository
from app.modules.hr.domains.leave.repositories.leave_balance import (
    LeaveBalanceRepository,
)
from app.modules.hr.domains.leave.repositories.leave_type import LeaveTypeRepository
from app.modules.hr.domains.leave.schemas.leave import LeaveCreateRequest
from app.modules.hr.domains.leave.schemas.leave_balance import LeaveBalanceCreateRequest
from app.modules.hr.domains.leave.schemas.leave_type import LeaveTypeCreateRequest
from app.modules.hr.domains.leave.services.leave import LeaveService
from app.modules.hr.domains.shift.repositories.shift import ShiftRepository
from app.modules.hr.domains.shift.repositories.shift_assignment import (
    ShiftAssignmentRepository,
)
from app.modules.hr.domains.shift.schemas.shift import ShiftCreateRequest
from app.modules.hr.domains.shift.services.shift import ShiftService
from app.modules.hr.domains.timeline.repositories.timeline import (
    AuditTimelineRepository,
)
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService


@pytest.fixture
async def setup_hr_auth(db_session: AsyncSession) -> dict[str, str]:
    company_id = uuid.uuid4()

    # 1. Create permissions
    perms = {}
    perm_names = [
        "attendance:create",
        "attendance:read",
        "attendance:update",
        "attendance:delete",
        "leave:create",
        "leave:read",
        "leave:update",
        "leave:delete",
        "shift:create",
        "shift:read",
        "holiday:create",
        "holiday:read",
        "recruitment:create",
        "recruitment:read",
        "recruitment:update",
        "promotion:create",
        "promotion:update",
        "transfer:create",
        "transfer:update",
        "performance:create",
        "performance:update",
        "training:create",
        "training:update",
    ]
    for perm_name in perm_names:
        perm = Permission(name=perm_name, description=f"Permission for {perm_name}")
        db_session.add(perm)
        perms[perm_name] = perm
    await db_session.flush()

    # 2. Create role
    role = Role(name="HR Manager", description="HR Management Role")
    db_session.add(role)
    await db_session.flush()

    # 3. Associate permissions to role
    for perm in perms.values():
        await db_session.execute(
            role_permissions.insert().values(role_id=role.id, permission_id=perm.id)
        )

    # 4. Create identity
    identity = Identity(
        email="hr@enterprise.com",
        password_hash=get_password_hash("password123"),
        account_status="Active",
        email_verified=True,
    )
    db_session.add(identity)
    await db_session.flush()

    # 5. Create user
    user = User(
        identity_id=identity.id,
        company_id=company_id,
        display_name="HR Director",
    )
    db_session.add(user)
    await db_session.flush()

    # 6. Associate user to role
    await db_session.execute(
        user_roles.insert().values(user_id=user.id, role_id=role.id)
    )

    # 7. Create session
    session = Session(
        identity_id=identity.id,
        is_active=True,
        expires_at=datetime.now(UTC).replace(tzinfo=None) + timedelta(days=1),
    )
    db_session.add(session)
    await db_session.flush()

    await db_session.commit()
    await db_session.refresh(identity)
    await db_session.refresh(user)

    # Generate token
    token = create_access_token(
        {
            "sub": str(identity.id),
            "sid": str(session.id),
            "tver": identity.token_version,
            "company_id": str(company_id),
            "roles": [role.name],
        }
    )

    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_attendance_conflict_and_workflow(db_session: AsyncSession) -> None:
    company_id = uuid.uuid4()
    employee_id = uuid.uuid4()

    attendance_repo = AttendanceRepository(db_session)
    timeline_repo = AuditTimelineRepository(db_session)
    timeline_service = AuditTimelineService(timeline_repo)
    service = AttendanceService(attendance_repo, timeline_service)

    # 1. Create first attendance record (Active check-in)
    payload1 = AttendanceCreateRequest(
        employee_id=employee_id,
        check_in=datetime.now(),
        check_out=None,
        breaks=None,
        overtime=0,
        status="Present",
    )
    record1 = await service.create_attendance(company_id, payload1)
    assert record1.workflow_state == "Draft"

    # 2. Try creating second check-in -> Should fail with ATTENDANCE_CONFLICT
    with pytest.raises(BusinessException) as exc:
        await service.create_attendance(company_id, payload1)
    assert exc.value.code == "ATTENDANCE_CONFLICT"

    # 3. Perform workflow transition: Draft -> Submitted -> Reviewed -> Approved
    record_id = record1.id
    record1 = await service.transition_attendance(company_id, record_id, "Submitted")
    assert record1.workflow_state == "Submitted"

    # Verify illegal jump (e.g. Submitted -> Approved directly is invalid without Reviewed)
    with pytest.raises(BusinessException) as exc:
        await service.transition_attendance(company_id, record_id, "Approved")
    assert exc.value.code == "INVALID_WORKFLOW_TRANSITION"

    # Complete transitions
    record1 = await service.transition_attendance(company_id, record_id, "Reviewed")
    record1 = await service.transition_attendance(company_id, record_id, "Approved")
    assert record1.workflow_state == "Approved"

    # 4. Check audit log was written
    timelines, count = await timeline_repo.get_paginated(
        company_id, page=1, size=10, entity_id=record_id
    )
    assert count == 3
    assert timelines[0].previous_state == "Draft"
    assert timelines[0].new_state == "Submitted"


@pytest.mark.asyncio
async def test_leave_balance_check(db_session: AsyncSession) -> None:
    company_id = uuid.uuid4()
    employee_id = uuid.uuid4()

    leave_repo = LeaveRepository(db_session)
    type_repo = LeaveTypeRepository(db_session)
    balance_repo = LeaveBalanceRepository(db_session)
    timeline_repo = AuditTimelineRepository(db_session)
    timeline_service = AuditTimelineService(timeline_repo)
    service = LeaveService(leave_repo, type_repo, balance_repo, timeline_service)

    # 1. Setup Active Employee
    from app.modules.employee.domains.profile.models.employee import Employee

    emp = Employee(
        id=employee_id,
        company_id=company_id,
        employee_code="EMP-BAL-TEST",
        first_name="Test",
        last_name="Employee",
        employment_status="Active",
        joining_date=date.today(),
    )
    db_session.add(emp)
    await db_session.flush()

    # 1. Setup Leave Type and Balance
    type_payload = LeaveTypeCreateRequest(name="Annual Leave", code="AL")
    ltype = await service.create_leave_type(company_id, type_payload)

    bal_payload = LeaveBalanceCreateRequest(
        employee_id=employee_id, leave_type_id=ltype.id, balance=5.0
    )
    await service.create_leave_balance(company_id, bal_payload)

    # 2. Request 6 days leave -> Should fail with LEAVE_BALANCE_EXCEEDED
    req_payload_fail = LeaveCreateRequest(
        employee_id=employee_id,
        leave_type_id=ltype.id,
        start_date=date.today(),
        end_date=date.today() + timedelta(days=5),  # 6 days
    )
    with pytest.raises(BusinessException) as exc:
        await service.create_leave_request(company_id, req_payload_fail)
    assert exc.value.code == "LEAVE_BALANCE_EXCEEDED"

    # 3. Request 3 days leave -> Should succeed
    req_payload_ok = LeaveCreateRequest(
        employee_id=employee_id,
        leave_type_id=ltype.id,
        start_date=date.today(),
        end_date=date.today() + timedelta(days=2),  # 3 days
    )
    request = await service.create_leave_request(company_id, req_payload_ok)
    assert request.workflow_state == "Draft"

    # Transition Draft -> Submitted -> Manager Review -> Approved
    request = await service.transition_leave(company_id, request.id, "Submitted")
    request = await service.transition_leave(company_id, request.id, "Manager Review")
    request = await service.transition_leave(company_id, request.id, "Approved")

    # Verify balance was deducted (5.0 - 3.0 = 2.0)
    balances, _ = await balance_repo.get_paginated(
        company_id, page=1, size=1, employee_id=employee_id, leave_type_id=ltype.id
    )
    assert balances[0].balance == 2.0


@pytest.mark.asyncio
async def test_shift_uniqueness(db_session: AsyncSession) -> None:
    company_id = uuid.uuid4()
    shift_repo = ShiftRepository(db_session)
    assign_repo = ShiftAssignmentRepository(db_session)
    service = ShiftService(shift_repo, assign_repo)

    payload = ShiftCreateRequest(
        name="Morning Shift", code="MORN", start_time=time(9, 0), end_time=time(17, 0)
    )
    # Create shift first time -> OK
    await service.create_shift(company_id, payload)

    # Create shift second time -> DUPLICATE_SHIFT
    with pytest.raises(BusinessException) as exc:
        await service.create_shift(company_id, payload)
    assert exc.value.code == "DUPLICATE_SHIFT"


@pytest.mark.asyncio
async def test_hr_api_routes(
    client: AsyncClient, setup_hr_auth: dict[str, str]
) -> None:
    # 1. Create a recruitment job opening via API
    job_payload = {
        "title": "Senior Python Architect",
        "department_id": str(uuid.uuid4()),
        "workflow_state": "Draft",
    }
    resp = await client.post(
        "/api/v1/recruitment/jobs", json=job_payload, headers=setup_hr_auth
    )
    assert resp.status_code == 201
    job_id = resp.json()["data"]["id"]

    # 2. Transition job opening
    trans_payload = {
        "state": "Published",
        "comment": "Ready for applications",
        "reason": "Approved budget",
    }
    resp = await client.post(
        f"/api/v1/recruitment/jobs/{job_id}/transition",
        json=trans_payload,
        headers=setup_hr_auth,
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["workflow_state"] == "Published"

    # 3. Verify get paginated list contains job opening
    resp = await client.get("/api/v1/recruitment/jobs", headers=setup_hr_auth)
    assert resp.status_code == 200
    assert len(resp.json()["data"]) == 1
    assert resp.json()["data"][0]["id"] == job_id
