import uuid
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.admin.domains.departments.repositories.department import (
    DepartmentRepository,
)
from app.modules.admin.domains.teams.repositories.team import TeamRepository
from app.modules.admin.domains.teams.schemas.schemas import (
    TeamCreateRequest,
    TeamResponse,
    TeamUpdateRequest,
)
from app.modules.admin.domains.teams.services.team import TeamService
from app.modules.auth.domains.users.models.user import User
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/teams", tags=["Team"])


def get_team_service(db: AsyncSession = Depends(get_db)) -> TeamService:
    return TeamService(
        repo=TeamRepository(db),
        dept_repo=DepartmentRepository(db),
    )


@router.post(
    "",
    response_model=SuccessResponse[TeamResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("organization:create"))],
)
async def create_team(
    payload: TeamCreateRequest,
    current_user: User = Depends(get_current_user),
    service: TeamService = Depends(get_team_service),
) -> Any:
    entity = await service.create_team(
        company_id=current_user.company_id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.get(
    "",
    response_model=SuccessResponse[list[TeamResponse]],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def list_teams(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    effective_date: date | None = Query(default=None),
    sort_by: str | None = Query(default=None),
    sort_order: str = Query(default="asc"),
    current_user: User = Depends(get_current_user),
    service: TeamService = Depends(get_team_service),
) -> Any:
    entities, total = await service.repo.get_paginated(
        company_id=current_user.company_id,
        page=page,
        size=size,
        search=search,
        is_active=is_active,
        effective_date=effective_date,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    meta = {"page": page, "size": size, "total_records": total}
    return SuccessResponse(data=entities, meta=meta)


@router.get(
    "/{id}",
    response_model=SuccessResponse[TeamResponse],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def get_team(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: TeamService = Depends(get_team_service),
) -> Any:
    entity = await service.repo.get_by_id_with_tenant(current_user.company_id, id)
    if not entity:
        from app.core.exceptions.base import NotFoundException

        raise NotFoundException("TEAM_NOT_FOUND", "Team not found")
    return SuccessResponse(data=entity)


@router.put(
    "/{id}",
    response_model=SuccessResponse[TeamResponse],
    dependencies=[Depends(PermissionGuard("organization:update"))],
)
async def update_team(
    id: uuid.UUID,
    payload: TeamUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: TeamService = Depends(get_team_service),
) -> Any:
    entity = await service.update_team(
        company_id=current_user.company_id,
        team_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.patch(
    "/{id}",
    response_model=SuccessResponse[TeamResponse],
    dependencies=[Depends(PermissionGuard("organization:update"))],
)
async def patch_team(
    id: uuid.UUID,
    payload: TeamUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: TeamService = Depends(get_team_service),
) -> Any:
    entity = await service.update_team(
        company_id=current_user.company_id,
        team_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(PermissionGuard("organization:delete"))],
)
async def delete_team(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: TeamService = Depends(get_team_service),
) -> None:
    await service.delete_team(
        company_id=current_user.company_id,
        team_id=id,
        actor_id=current_user.id,
    )
    return None
