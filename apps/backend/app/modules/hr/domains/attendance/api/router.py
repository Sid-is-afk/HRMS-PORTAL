import uuid
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.attendance.repositories.attendance import (
    AttendanceRepository,
)
from app.modules.hr.domains.attendance.schemas.attendance import (
    AttendanceCreateRequest,
    AttendanceResponse,
    AttendanceUpdateRequest,
)
from app.modules.hr.domains.attendance.services.attendance import AttendanceService
from app.modules.hr.domains.timeline.repositories.timeline import (
    AuditTimelineRepository,
)
from app.modules.hr.domains.timeline.schemas.timeline import StateTransitionRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/attendance", tags=["Attendance"])


def get_service(db: AsyncSession = Depends(get_db)) -> AttendanceService:
    repo = AttendanceRepository(db)
    timeline_repo = AuditTimelineRepository(db)
    timeline_service = AuditTimelineService(timeline_repo)
    return AttendanceService(repo, timeline_service)


@router.post(
    "",
    response_model=SuccessResponse[AttendanceResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("attendance:create"))],
)
async def create(
    payload: AttendanceCreateRequest,
    current_user: User = Depends(get_current_user),
    service: AttendanceService = Depends(get_service),
) -> Any:
    entity = await service.create_attendance(
        company_id=current_user.company_id, payload=payload, actor_id=current_user.id
    )
    return SuccessResponse(data=entity)


@router.get(
    "",
    response_model=SuccessResponse[list[AttendanceResponse]],
    dependencies=[Depends(PermissionGuard("attendance:read"))],
)
async def list_all(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=100),
    search: str | None = None,
    workflow_state: str | None = None,
    employee_id: uuid.UUID | None = None,
    sort_by: str | None = None,
    sort_order: str = "asc",
    current_user: User = Depends(get_current_user),
    service: AttendanceService = Depends(get_service),
) -> Any:
    entities, total = await service.repo.get_paginated(
        company_id=current_user.company_id,
        page=page,
        size=size,
        search=search,
        workflow_state=workflow_state,
        employee_id=employee_id,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return SuccessResponse(
        data=entities, metadata={"total": total, "page": page, "size": size}
    )


@router.get(
    "/{id}",
    response_model=SuccessResponse[AttendanceResponse],
    dependencies=[Depends(PermissionGuard("attendance:read"))],
)
async def get_by_id(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: AttendanceService = Depends(get_service),
) -> Any:
    entity = await service.get_by_id(current_user.company_id, id)
    return SuccessResponse(data=entity)


@router.put(
    "/{id}",
    response_model=SuccessResponse[AttendanceResponse],
    dependencies=[Depends(PermissionGuard("attendance:update"))],
)
async def update(
    id: uuid.UUID,
    payload: AttendanceUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: AttendanceService = Depends(get_service),
) -> Any:
    entity = await service.update_attendance(current_user.company_id, id, payload)
    return SuccessResponse(data=entity)


@router.delete(
    "/{id}",
    response_model=SuccessResponse[None],
    dependencies=[Depends(PermissionGuard("attendance:delete"))],
)
async def delete(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: AttendanceService = Depends(get_service),
) -> Any:
    await service.get_by_id(current_user.company_id, id)
    await service.repo.delete_by_id(id)
    return SuccessResponse(data=None)


@router.post(
    "/{id}/transition",
    response_model=SuccessResponse[AttendanceResponse],
    dependencies=[Depends(PermissionGuard("attendance:update"))],
)
async def transition(
    id: uuid.UUID,
    payload: StateTransitionRequest,
    current_user: User = Depends(get_current_user),
    service: AttendanceService = Depends(get_service),
) -> Any:
    entity = await service.transition_attendance(
        company_id=current_user.company_id,
        record_id=id,
        new_state=payload.state,
        actor_id=current_user.id,
        comment=payload.comment,
        reason=payload.reason,
    )
    return SuccessResponse(data=entity)
