from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.shift.repositories.shift import ShiftRepository
from app.modules.hr.domains.shift.repositories.shift_assignment import (
    ShiftAssignmentRepository,
)
from app.modules.hr.domains.shift.schemas.shift import ShiftCreateRequest, ShiftResponse
from app.modules.hr.domains.shift.schemas.shift_assignment import (
    ShiftAssignmentCreateRequest,
    ShiftAssignmentResponse,
)
from app.modules.hr.domains.shift.services.shift import ShiftService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/shift", tags=["Shift"])


def get_service(db: AsyncSession = Depends(get_db)) -> ShiftService:
    shift_repo = ShiftRepository(db)
    assign_repo = ShiftAssignmentRepository(db)
    return ShiftService(shift_repo, assign_repo)


@router.post(
    "",
    response_model=SuccessResponse[ShiftResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("shift:create"))],
)
async def create(
    payload: ShiftCreateRequest,
    current_user: User = Depends(get_current_user),
    service: ShiftService = Depends(get_service),
) -> Any:
    entity = await service.create_shift(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.get(
    "",
    response_model=SuccessResponse[list[ShiftResponse]],
    dependencies=[Depends(PermissionGuard("shift:read"))],
)
async def list_shifts(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    service: ShiftService = Depends(get_service),
) -> Any:
    entities, total = await service.shift_repo.get_paginated(
        company_id=current_user.company_id, page=page, size=size
    )
    return SuccessResponse(
        data=entities, metadata={"total": total, "page": page, "size": size}
    )


@router.post(
    "/assignments",
    response_model=SuccessResponse[ShiftAssignmentResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("shift:create"))],
)
async def assign(
    payload: ShiftAssignmentCreateRequest,
    current_user: User = Depends(get_current_user),
    service: ShiftService = Depends(get_service),
) -> Any:
    entity = await service.create_assignment(current_user.company_id, payload)
    return SuccessResponse(data=entity)
