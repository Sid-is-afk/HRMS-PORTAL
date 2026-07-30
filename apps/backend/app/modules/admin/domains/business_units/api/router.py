import uuid
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.admin.domains.business_units.repositories.business_unit import (
    BusinessUnitRepository,
)
from app.modules.admin.domains.business_units.schemas.schemas import (
    BusinessUnitCreateRequest,
    BusinessUnitResponse,
    BusinessUnitUpdateRequest,
)
from app.modules.admin.domains.business_units.services.business_unit import (
    BusinessUnitService,
)
from app.modules.admin.domains.departments.repositories.department import (
    DepartmentRepository,
)
from app.modules.admin.domains.divisions.repositories.division import DivisionRepository
from app.modules.admin.domains.organization.repositories.organization import (
    OrganizationRepository,
)
from app.modules.admin.domains.teams.repositories.team import TeamRepository
from app.modules.auth.domains.users.models.user import User
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/business-units", tags=["BusinessUnit"])


def get_business_unit_service(
    db: AsyncSession = Depends(get_db),
) -> BusinessUnitService:
    return BusinessUnitService(
        repo=BusinessUnitRepository(db),
        org_repo=OrganizationRepository(db),
        div_repo=DivisionRepository(db),
        dept_repo=DepartmentRepository(db),
        team_repo=TeamRepository(db),
    )


@router.post(
    "",
    response_model=SuccessResponse[BusinessUnitResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("organization:create"))],
)
async def create_business_unit(
    payload: BusinessUnitCreateRequest,
    current_user: User = Depends(get_current_user),
    service: BusinessUnitService = Depends(get_business_unit_service),
) -> Any:
    entity = await service.create_business_unit(
        company_id=current_user.company_id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.get(
    "",
    response_model=SuccessResponse[list[BusinessUnitResponse]],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def list_business_units(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    effective_date: date | None = Query(default=None),
    sort_by: str | None = Query(default=None),
    sort_order: str = Query(default="asc"),
    current_user: User = Depends(get_current_user),
    service: BusinessUnitService = Depends(get_business_unit_service),
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
    response_model=SuccessResponse[BusinessUnitResponse],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def get_business_unit(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: BusinessUnitService = Depends(get_business_unit_service),
) -> Any:
    entity = await service.repo.get_by_id_with_tenant(current_user.company_id, id)
    if not entity:
        from app.core.exceptions.base import NotFoundException

        raise NotFoundException("BUSINESSUNIT_NOT_FOUND", "BusinessUnit not found")
    return SuccessResponse(data=entity)


@router.put(
    "/{id}",
    response_model=SuccessResponse[BusinessUnitResponse],
    dependencies=[Depends(PermissionGuard("organization:update"))],
)
async def update_business_unit(
    id: uuid.UUID,
    payload: BusinessUnitUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: BusinessUnitService = Depends(get_business_unit_service),
) -> Any:
    entity = await service.update_business_unit(
        company_id=current_user.company_id,
        business_unit_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.patch(
    "/{id}",
    response_model=SuccessResponse[BusinessUnitResponse],
    dependencies=[Depends(PermissionGuard("organization:update"))],
)
async def patch_business_unit(
    id: uuid.UUID,
    payload: BusinessUnitUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: BusinessUnitService = Depends(get_business_unit_service),
) -> Any:
    entity = await service.update_business_unit(
        company_id=current_user.company_id,
        business_unit_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(PermissionGuard("organization:delete"))],
)
async def delete_business_unit(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: BusinessUnitService = Depends(get_business_unit_service),
) -> None:
    await service.delete_business_unit(
        company_id=current_user.company_id,
        business_unit_id=id,
        actor_id=current_user.id,
    )
    return None
