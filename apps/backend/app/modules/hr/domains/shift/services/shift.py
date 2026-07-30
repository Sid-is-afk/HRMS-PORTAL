import uuid

from app.core.exceptions.base import BusinessException
from app.modules.hr.domains.shift.models.shift import Shift
from app.modules.hr.domains.shift.models.shift_assignment import ShiftAssignment
from app.modules.hr.domains.shift.repositories.shift import ShiftRepository
from app.modules.hr.domains.shift.repositories.shift_assignment import (
    ShiftAssignmentRepository,
)
from app.modules.hr.domains.shift.schemas.shift import ShiftCreateRequest
from app.modules.hr.domains.shift.schemas.shift_assignment import (
    ShiftAssignmentCreateRequest,
)


class ShiftService:
    def __init__(
        self, shift_repo: ShiftRepository, assign_repo: ShiftAssignmentRepository
    ):
        self.shift_repo = shift_repo
        self.assign_repo = assign_repo

    async def get_shift(self, company_id: uuid.UUID, shift_id: uuid.UUID) -> Shift:
        res = await self.shift_repo.get_by_id_with_tenant(company_id, shift_id)
        if not res:
            raise BusinessException("ENTITY_NOT_FOUND", "Shift not found")
        return res

    async def create_shift(
        self, company_id: uuid.UUID, payload: ShiftCreateRequest
    ) -> Shift:
        # Check duplicate shift code
        dups, _ = await self.shift_repo.get_paginated(
            company_id=company_id, page=1, size=1, code=payload.code
        )
        if dups:
            raise BusinessException(
                "DUPLICATE_SHIFT", "Shift with this code already exists"
            )

        shift = Shift(
            company_id=company_id,
            name=payload.name,
            code=payload.code,
            start_time=payload.start_time,
            end_time=payload.end_time,
        )
        return await self.shift_repo.create(shift)

    async def create_assignment(
        self, company_id: uuid.UUID, payload: ShiftAssignmentCreateRequest
    ) -> ShiftAssignment:
        assignment = ShiftAssignment(
            company_id=company_id,
            employee_id=payload.employee_id,
            shift_id=payload.shift_id,
            start_date=payload.start_date,
            end_date=payload.end_date,
        )
        return await self.assign_repo.create(assignment)
