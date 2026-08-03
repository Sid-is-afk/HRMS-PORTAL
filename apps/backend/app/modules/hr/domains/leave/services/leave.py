import uuid

from app.core.exceptions.base import BusinessException
from app.events.publishers.hr import publish_hr_event
from app.modules.hr.domains.events import LeaveApproved, LeaveRejected, LeaveSubmitted
from app.modules.hr.domains.leave.models.leave import Leave
from app.modules.hr.domains.leave.models.leave_balance import LeaveBalance
from app.modules.hr.domains.leave.models.leave_type import LeaveType
from app.modules.hr.domains.leave.repositories.leave import LeaveRepository
from app.modules.hr.domains.leave.repositories.leave_balance import (
    LeaveBalanceRepository,
)
from app.modules.hr.domains.leave.repositories.leave_type import LeaveTypeRepository
from app.modules.hr.domains.leave.schemas.leave import LeaveCreateRequest
from app.modules.hr.domains.leave.schemas.leave_balance import LeaveBalanceCreateRequest
from app.modules.hr.domains.leave.schemas.leave_type import LeaveTypeCreateRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService


class LeaveService:
    def __init__(
        self,
        leave_repo: LeaveRepository,
        type_repo: LeaveTypeRepository,
        balance_repo: LeaveBalanceRepository,
        timeline_service: AuditTimelineService,
    ):
        self.leave_repo = leave_repo
        self.type_repo = type_repo
        self.balance_repo = balance_repo
        self.timeline_service = timeline_service

    # Leave Types
    async def create_leave_type(
        self, company_id: uuid.UUID, payload: LeaveTypeCreateRequest
    ) -> LeaveType:
        item = LeaveType(company_id=company_id, name=payload.name, code=payload.code)
        return await self.type_repo.create(item)

    async def get_leave_type(
        self, company_id: uuid.UUID, type_id: uuid.UUID
    ) -> LeaveType:
        res = await self.type_repo.get_by_id_with_tenant(company_id, type_id)
        if not res:
            raise BusinessException("ENTITY_NOT_FOUND", "Leave type not found")
        return res

    # Leave Balances
    async def create_leave_balance(
        self, company_id: uuid.UUID, payload: LeaveBalanceCreateRequest
    ) -> LeaveBalance:
        item = LeaveBalance(
            company_id=company_id,
            employee_id=payload.employee_id,
            leave_type_id=payload.leave_type_id,
            balance=payload.balance,
        )
        return await self.balance_repo.create(item)

    # Leave Requests
    async def get_leave_request(
        self, company_id: uuid.UUID, request_id: uuid.UUID
    ) -> Leave:
        res = await self.leave_repo.get_by_id_with_tenant(company_id, request_id)
        if not res:
            raise BusinessException("ENTITY_NOT_FOUND", "Leave request not found")
        return res

    async def create_leave_request(
        self, company_id: uuid.UUID, payload: LeaveCreateRequest
    ) -> Leave:
        # Check active employee policy
        from app.modules.employee.domains.profile.repositories.employee import (
            EmployeeRepository,
        )
        from app.modules.shared.policies.active_employee import ActiveEmployeePolicy

        emp_repo = EmployeeRepository(self.leave_repo.session)
        await ActiveEmployeePolicy(emp_repo).check(payload.employee_id)

        # Check leave balance
        balances, _ = await self.balance_repo.get_paginated(
            company_id=company_id,
            page=1,
            size=1,
            employee_id=payload.employee_id,
            leave_type_id=payload.leave_type_id,
        )
        if not balances:
            raise BusinessException(
                "LEAVE_BALANCE_EXCEEDED",
                "No leave balance established for this leave type",
            )

        requested_days = (payload.end_date - payload.start_date).days + 1
        if balances[0].balance < requested_days:
            raise BusinessException(
                "LEAVE_BALANCE_EXCEEDED", "Insufficient leave balance"
            )

        request = Leave(
            company_id=company_id,
            employee_id=payload.employee_id,
            leave_type_id=payload.leave_type_id,
            start_date=payload.start_date,
            end_date=payload.end_date,
            workflow_state="Draft",
        )
        return await self.leave_repo.create(request)

    async def transition_leave(
        self,
        company_id: uuid.UUID,
        request_id: uuid.UUID,
        new_state: str,
        actor_id: uuid.UUID | None = None,
        comment: str | None = None,
        reason: str | None = None,
    ) -> Leave:
        request = await self.get_leave_request(company_id, request_id)
        curr_state = request.workflow_state

        # Workflow: Draft -> Submitted -> Manager Review -> HR Review -> Approved/Rejected/Cancelled/Completed
        allowed = False
        if curr_state == "Draft" and new_state == "Submitted":
            allowed = True
        elif curr_state == "Submitted" and new_state == "Manager Review":
            allowed = True
        elif curr_state == "Manager Review" and new_state in [
            "HR Review",
            "Approved",
            "Rejected",
        ]:
            allowed = True
        elif curr_state == "HR Review" and new_state in ["Approved", "Rejected"]:
            allowed = True
        elif curr_state == "Approved" and new_state in ["Completed", "Cancelled"]:
            allowed = True

        if not allowed:
            raise BusinessException(
                "INVALID_WORKFLOW_TRANSITION",
                f"Cannot transition leave request from {curr_state} to {new_state}",
            )

        # If transitioning to Approved, deduct leave balance
        if new_state == "Approved":
            balances, _ = await self.balance_repo.get_paginated(
                company_id=company_id,
                page=1,
                size=1,
                employee_id=request.employee_id,
                leave_type_id=request.leave_type_id,
            )
            if not balances:
                raise BusinessException(
                    "LEAVE_BALANCE_EXCEEDED", "No leave balance found"
                )
            requested_days = (request.end_date - request.start_date).days + 1
            if balances[0].balance < requested_days:
                raise BusinessException(
                    "LEAVE_BALANCE_EXCEEDED",
                    "Insufficient leave balance at approval stage",
                )
            balances[0].balance -= requested_days
            await self.balance_repo.create(balances[0])

        request.workflow_state = new_state
        updated = await self.leave_repo.create(request)

        # Log timeline
        await self.timeline_service.log_transition(
            company_id=company_id,
            entity_type="LeaveRequest",
            entity_id=request_id,
            previous_state=curr_state,
            new_state=new_state,
            actor_id=actor_id,
            comment=comment,
            reason=reason,
        )

        # Publish event
        if new_state == "Submitted":
            await publish_hr_event(
                LeaveSubmitted(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"leave_request_id": str(request_id)},
                )
            )
        elif new_state == "Approved":
            await publish_hr_event(
                LeaveApproved(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"leave_request_id": str(request_id)},
                )
            )
        elif new_state == "Rejected":
            await publish_hr_event(
                LeaveRejected(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"leave_request_id": str(request_id)},
                )
            )

        return updated
