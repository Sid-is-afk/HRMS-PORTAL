import uuid
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.admin.domains.branches.repositories.branch import BranchRepository
from app.modules.admin.domains.locations.repositories.location import LocationRepository
from app.modules.admin.domains.locations.schemas.schemas import (
    LocationCreateRequest,
    LocationResponse,
    LocationUpdateRequest,
)
from app.modules.admin.domains.locations.services.location import LocationService
from app.modules.auth.domains.users.models.user import User
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/locations", tags=["Location"])


def get_location_service(db: AsyncSession = Depends(get_db)) -> LocationService:
    return LocationService(
        repo=LocationRepository(db),
        branch_repo=BranchRepository(db),
    )


@router.post(
    "",
    response_model=SuccessResponse[LocationResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("location:create"))],
)
async def create_location(
    payload: LocationCreateRequest,
    current_user: User = Depends(get_current_user),
    service: LocationService = Depends(get_location_service),
) -> Any:
    entity = await service.create_location(
        company_id=current_user.company_id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.get(
    "",
    response_model=SuccessResponse[list[LocationResponse]],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def list_locations(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    effective_date: date | None = Query(default=None),
    sort_by: str | None = Query(default=None),
    sort_order: str = Query(default="asc"),
    current_user: User = Depends(get_current_user),
    service: LocationService = Depends(get_location_service),
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
    response_model=SuccessResponse[LocationResponse],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def get_location(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: LocationService = Depends(get_location_service),
) -> Any:
    entity = await service.repo.get_by_id_with_tenant(current_user.company_id, id)
    if not entity:
        from app.core.exceptions.base import NotFoundException

        raise NotFoundException("LOCATION_NOT_FOUND", "Location not found")
    return SuccessResponse(data=entity)


@router.put(
    "/{id}",
    response_model=SuccessResponse[LocationResponse],
    dependencies=[Depends(PermissionGuard("location:update"))],
)
async def update_location(
    id: uuid.UUID,
    payload: LocationUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: LocationService = Depends(get_location_service),
) -> Any:
    entity = await service.update_location(
        company_id=current_user.company_id,
        location_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.patch(
    "/{id}",
    response_model=SuccessResponse[LocationResponse],
    dependencies=[Depends(PermissionGuard("location:update"))],
)
async def patch_location(
    id: uuid.UUID,
    payload: LocationUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: LocationService = Depends(get_location_service),
) -> Any:
    entity = await service.update_location(
        company_id=current_user.company_id,
        location_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(PermissionGuard("organization:delete"))],
)
async def delete_location(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: LocationService = Depends(get_location_service),
) -> None:
    await service.delete_location(
        company_id=current_user.company_id,
        location_id=id,
        actor_id=current_user.id,
    )
    return None
