import uuid
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.admin.domains.designations.repositories.designation import (
    DesignationRepository,
)
from app.modules.admin.domains.designations.schemas.schemas import (
    DesignationCreateRequest,
    DesignationResponse,
    DesignationUpdateRequest,
)
from app.modules.admin.domains.designations.services.designation import (
    DesignationService,
)
from app.modules.admin.domains.job_levels.repositories.job_level import (
    JobLevelRepository,
)
from app.modules.auth.domains.users.models.user import User
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/designations", tags=["Designation"])


def get_designation_service(db: AsyncSession = Depends(get_db)) -> DesignationService:
    return DesignationService(
        repo=DesignationRepository(db),
        jl_repo=JobLevelRepository(db),
    )


@router.post(
    "",
    response_model=SuccessResponse[DesignationResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("designation:create"))],
)
async def create_designation(
    payload: DesignationCreateRequest,
    current_user: User = Depends(get_current_user),
    service: DesignationService = Depends(get_designation_service),
) -> Any:
    entity = await service.create_designation(
        company_id=current_user.company_id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.get(
    "",
    response_model=SuccessResponse[list[DesignationResponse]],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def list_designations(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    effective_date: date | None = Query(default=None),
    sort_by: str | None = Query(default=None),
    sort_order: str = Query(default="asc"),
    current_user: User = Depends(get_current_user),
    service: DesignationService = Depends(get_designation_service),
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
    response_model=SuccessResponse[DesignationResponse],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def get_designation(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: DesignationService = Depends(get_designation_service),
) -> Any:
    entity = await service.repo.get_by_id_with_tenant(current_user.company_id, id)
    if not entity:
        from app.core.exceptions.base import NotFoundException

        raise NotFoundException("DESIGNATION_NOT_FOUND", "Designation not found")
    return SuccessResponse(data=entity)


@router.put(
    "/{id}",
    response_model=SuccessResponse[DesignationResponse],
    dependencies=[Depends(PermissionGuard("designation:update"))],
)
async def update_designation(
    id: uuid.UUID,
    payload: DesignationUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: DesignationService = Depends(get_designation_service),
) -> Any:
    entity = await service.update_designation(
        company_id=current_user.company_id,
        designation_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.patch(
    "/{id}",
    response_model=SuccessResponse[DesignationResponse],
    dependencies=[Depends(PermissionGuard("designation:update"))],
)
async def patch_designation(
    id: uuid.UUID,
    payload: DesignationUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: DesignationService = Depends(get_designation_service),
) -> Any:
    entity = await service.update_designation(
        company_id=current_user.company_id,
        designation_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(PermissionGuard("organization:delete"))],
)
async def delete_designation(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: DesignationService = Depends(get_designation_service),
) -> None:
    await service.delete_designation(
        company_id=current_user.company_id,
        designation_id=id,
        actor_id=current_user.id,
    )
    return None
