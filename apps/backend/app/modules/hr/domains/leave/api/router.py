import uuid
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.leave.repositories.leave import LeaveRepository
from app.modules.hr.domains.leave.repositories.leave_balance import (
    LeaveBalanceRepository,
)
from app.modules.hr.domains.leave.repositories.leave_type import LeaveTypeRepository
from app.modules.hr.domains.leave.schemas.leave import (
    LeaveCreateRequest,
    LeaveResponse,
)
from app.modules.hr.domains.leave.schemas.leave_balance import (
    LeaveBalanceCreateRequest,
    LeaveBalanceResponse,
)
from app.modules.hr.domains.leave.schemas.leave_type import (
    LeaveTypeCreateRequest,
    LeaveTypeResponse,
)
from app.modules.hr.domains.leave.services.leave import LeaveService
from app.modules.hr.domains.timeline.repositories.timeline import (
    AuditTimelineRepository,
)
from app.modules.hr.domains.timeline.schemas.timeline import StateTransitionRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/leave", tags=["Leave"])


def get_service(db: AsyncSession = Depends(get_db)) -> LeaveService:
    leave_repo = LeaveRepository(db)
    type_repo = LeaveTypeRepository(db)
    balance_repo = LeaveBalanceRepository(db)
    timeline_repo = AuditTimelineRepository(db)
    timeline_service = AuditTimelineService(timeline_repo)
    return LeaveService(leave_repo, type_repo, balance_repo, timeline_service)


# Leave Types
@router.post(
    "/types",
    response_model=SuccessResponse[LeaveTypeResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("leave:create"))],
)
async def create_type(
    payload: LeaveTypeCreateRequest,
    current_user: User = Depends(get_current_user),
    service: LeaveService = Depends(get_service),
) -> Any:
    entity = await service.create_leave_type(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.get(
    "/types",
    response_model=SuccessResponse[list[LeaveTypeResponse]],
    dependencies=[Depends(PermissionGuard("leave:read"))],
)
async def list_types(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    service: LeaveService = Depends(get_service),
) -> Any:
    entities, total = await service.type_repo.get_paginated(
        company_id=current_user.company_id, page=page, size=size
    )
    return SuccessResponse(
        data=entities, metadata={"total": total, "page": page, "size": size}
    )


# Leave Balances
@router.post(
    "/balances",
    response_model=SuccessResponse[LeaveBalanceResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("leave:create"))],
)
async def create_balance(
    payload: LeaveBalanceCreateRequest,
    current_user: User = Depends(get_current_user),
    service: LeaveService = Depends(get_service),
) -> Any:
    entity = await service.create_leave_balance(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.get(
    "/balances",
    response_model=SuccessResponse[list[LeaveBalanceResponse]],
    dependencies=[Depends(PermissionGuard("leave:read"))],
)
async def list_balances(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=100),
    employee_id: uuid.UUID | None = None,
    current_user: User = Depends(get_current_user),
    service: LeaveService = Depends(get_service),
) -> Any:
    entities, total = await service.balance_repo.get_paginated(
        company_id=current_user.company_id,
        page=page,
        size=size,
        employee_id=employee_id,
    )
    return SuccessResponse(
        data=entities, metadata={"total": total, "page": page, "size": size}
    )


# Leave Requests
@router.post(
    "/requests",
    response_model=SuccessResponse[LeaveResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("leave:create"))],
)
async def create_request(
    payload: LeaveCreateRequest,
    current_user: User = Depends(get_current_user),
    service: LeaveService = Depends(get_service),
) -> Any:
    entity = await service.create_leave_request(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.get(
    "/requests",
    response_model=SuccessResponse[list[LeaveResponse]],
    dependencies=[Depends(PermissionGuard("leave:read"))],
)
async def list_requests(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=100),
    employee_id: uuid.UUID | None = None,
    workflow_state: str | None = None,
    current_user: User = Depends(get_current_user),
    service: LeaveService = Depends(get_service),
) -> Any:
    entities, total = await service.leave_repo.get_paginated(
        company_id=current_user.company_id,
        page=page,
        size=size,
        employee_id=employee_id,
        workflow_state=workflow_state,
    )
    return SuccessResponse(
        data=entities, metadata={"total": total, "page": page, "size": size}
    )


@router.get(
    "/requests/{id}",
    response_model=SuccessResponse[LeaveResponse],
    dependencies=[Depends(PermissionGuard("leave:read"))],
)
async def get_request_by_id(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: LeaveService = Depends(get_service),
) -> Any:
    entity = await service.get_leave_request(current_user.company_id, id)
    return SuccessResponse(data=entity)


@router.post(
    "/requests/{id}/transition",
    response_model=SuccessResponse[LeaveResponse],
    dependencies=[Depends(PermissionGuard("leave:update"))],
)
async def transition(
    id: uuid.UUID,
    payload: StateTransitionRequest,
    current_user: User = Depends(get_current_user),
    service: LeaveService = Depends(get_service),
) -> Any:
    entity = await service.transition_leave(
        company_id=current_user.company_id,
        request_id=id,
        new_state=payload.state,
        actor_id=current_user.id,
        comment=payload.comment,
        reason=payload.reason,
    )
    return SuccessResponse(data=entity)
