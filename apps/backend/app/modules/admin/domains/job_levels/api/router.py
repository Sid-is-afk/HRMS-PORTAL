import uuid
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.admin.domains.job_levels.repositories.job_level import (
    JobLevelRepository,
)
from app.modules.admin.domains.job_levels.schemas.schemas import (
    JobLevelCreateRequest,
    JobLevelResponse,
    JobLevelUpdateRequest,
)
from app.modules.admin.domains.job_levels.services.job_level import JobLevelService
from app.modules.auth.domains.users.models.user import User
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/job-levels", tags=["JobLevel"])


def get_job_level_service(db: AsyncSession = Depends(get_db)) -> JobLevelService:
    return JobLevelService(
        repo=JobLevelRepository(db),
    )


@router.post(
    "",
    response_model=SuccessResponse[JobLevelResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("organization:create"))],
)
async def create_job_level(
    payload: JobLevelCreateRequest,
    current_user: User = Depends(get_current_user),
    service: JobLevelService = Depends(get_job_level_service),
) -> Any:
    entity = await service.create_job_level(
        company_id=current_user.company_id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.get(
    "",
    response_model=SuccessResponse[list[JobLevelResponse]],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def list_job_levels(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    effective_date: date | None = Query(default=None),
    sort_by: str | None = Query(default=None),
    sort_order: str = Query(default="asc"),
    current_user: User = Depends(get_current_user),
    service: JobLevelService = Depends(get_job_level_service),
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
    response_model=SuccessResponse[JobLevelResponse],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def get_job_level(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: JobLevelService = Depends(get_job_level_service),
) -> Any:
    entity = await service.repo.get_by_id_with_tenant(current_user.company_id, id)
    if not entity:
        from app.core.exceptions.base import NotFoundException

        raise NotFoundException("JOBLEVEL_NOT_FOUND", "JobLevel not found")
    return SuccessResponse(data=entity)


@router.put(
    "/{id}",
    response_model=SuccessResponse[JobLevelResponse],
    dependencies=[Depends(PermissionGuard("organization:update"))],
)
async def update_job_level(
    id: uuid.UUID,
    payload: JobLevelUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: JobLevelService = Depends(get_job_level_service),
) -> Any:
    entity = await service.update_job_level(
        company_id=current_user.company_id,
        job_level_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.patch(
    "/{id}",
    response_model=SuccessResponse[JobLevelResponse],
    dependencies=[Depends(PermissionGuard("organization:update"))],
)
async def patch_job_level(
    id: uuid.UUID,
    payload: JobLevelUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: JobLevelService = Depends(get_job_level_service),
) -> Any:
    entity = await service.update_job_level(
        company_id=current_user.company_id,
        job_level_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(PermissionGuard("organization:delete"))],
)
async def delete_job_level(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: JobLevelService = Depends(get_job_level_service),
) -> None:
    await service.delete_job_level(
        company_id=current_user.company_id,
        job_level_id=id,
        actor_id=current_user.id,
    )
    return None
