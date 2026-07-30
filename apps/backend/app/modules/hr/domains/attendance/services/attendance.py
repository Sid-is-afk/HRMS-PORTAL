import uuid

from app.core.exceptions.base import BusinessException
from app.events.publishers.hr import publish_hr_event
from app.modules.hr.domains.attendance.models.attendance import Attendance
from app.modules.hr.domains.attendance.repositories.attendance import (
    AttendanceRepository,
)
from app.modules.hr.domains.attendance.schemas.attendance import (
    AttendanceCreateRequest,
    AttendanceUpdateRequest,
)
from app.modules.hr.domains.events import AttendanceApproved, AttendanceSubmitted
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService


class AttendanceService:
    def __init__(
        self, repo: AttendanceRepository, timeline_service: AuditTimelineService
    ):
        self.repo = repo
        self.timeline_service = timeline_service

    async def get_by_id(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Attendance:
        record = await self.repo.get_by_id_with_tenant(company_id, entity_id)
        if not record:
            raise BusinessException("ENTITY_NOT_FOUND", "Attendance record not found")
        return record

    async def create_attendance(
        self,
        company_id: uuid.UUID,
        payload: AttendanceCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Attendance:
        # Check if active check-in exists for employee (check-out is None)
        active_records, _ = await self.repo.get_paginated(
            company_id=company_id,
            page=1,
            size=1,
            employee_id=payload.employee_id,
            check_out=None,
        )
        if active_records:
            raise BusinessException(
                "ATTENDANCE_CONFLICT", "Employee already has an active check-in"
            )

        record = Attendance(
            company_id=company_id,
            employee_id=payload.employee_id,
            check_in=payload.check_in,
            check_out=payload.check_out,
            breaks=payload.breaks,
            overtime=payload.overtime,
            status=payload.status,
            workflow_state="Draft",
        )
        return await self.repo.create(record)

    async def update_attendance(
        self,
        company_id: uuid.UUID,
        record_id: uuid.UUID,
        payload: AttendanceUpdateRequest,
    ) -> Attendance:
        record = await self.get_by_id(company_id, record_id)
        for key, val in payload.model_dump(exclude_unset=True).items():
            setattr(record, key, val)
        return await self.repo.create(record)

    async def transition_attendance(
        self,
        company_id: uuid.UUID,
        record_id: uuid.UUID,
        new_state: str,
        actor_id: uuid.UUID | None = None,
        comment: str | None = None,
        reason: str | None = None,
    ) -> Attendance:
        record = await self.get_by_id(company_id, record_id)
        curr_state = record.workflow_state

        # Validate workflow transition
        # Draft -> Submitted -> Reviewed -> Approved/Closed
        allowed = False
        if curr_state == "Draft" and new_state == "Submitted":
            allowed = True
        elif curr_state == "Submitted" and new_state == "Reviewed":
            allowed = True
        elif curr_state == "Reviewed" and new_state in ["Approved", "Closed"]:
            allowed = True

        if not allowed:
            raise BusinessException(
                "INVALID_WORKFLOW_TRANSITION",
                f"Cannot transition attendance from {curr_state} to {new_state}",
            )

        record.workflow_state = new_state
        updated = await self.repo.create(record)

        # Log to timeline
        await self.timeline_service.log_transition(
            company_id=company_id,
            entity_type="Attendance",
            entity_id=record_id,
            previous_state=curr_state,
            new_state=new_state,
            actor_id=actor_id,
            comment=comment,
            reason=reason,
        )

        # Publish events
        if new_state == "Submitted":
            await publish_hr_event(
                AttendanceSubmitted(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"attendance_id": str(record_id)},
                )
            )
        elif new_state == "Approved":
            await publish_hr_event(
                AttendanceApproved(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"attendance_id": str(record_id)},
                )
            )

        return updated
