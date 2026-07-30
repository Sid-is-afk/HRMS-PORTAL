import uuid
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.admin.domains.branches.repositories.branch import BranchRepository
from app.modules.admin.domains.business_units.repositories.business_unit import (
    BusinessUnitRepository,
)
from app.modules.admin.domains.cost_centers.repositories.cost_center import (
    CostCenterRepository,
)
from app.modules.admin.domains.departments.repositories.department import (
    DepartmentRepository,
)
from app.modules.admin.domains.divisions.repositories.division import DivisionRepository
from app.modules.admin.domains.locations.repositories.location import LocationRepository
from app.modules.admin.domains.organization.repositories.organization import (
    OrganizationRepository,
)
from app.modules.admin.domains.organization.schemas.schemas import (
    OrganizationCreateRequest,
    OrganizationResponse,
    OrganizationUpdateRequest,
)
from app.modules.admin.domains.organization.services.organization import (
    OrganizationService,
)
from app.modules.admin.domains.teams.repositories.team import TeamRepository
from app.modules.auth.domains.users.models.user import User
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/organizations", tags=["Organization"])


def get_organization_service(db: AsyncSession = Depends(get_db)) -> OrganizationService:
    return OrganizationService(
        repo=OrganizationRepository(db),
        bu_repo=BusinessUnitRepository(db),
        div_repo=DivisionRepository(db),
        dept_repo=DepartmentRepository(db),
        team_repo=TeamRepository(db),
        branch_repo=BranchRepository(db),
        loc_repo=LocationRepository(db),
        cc_repo=CostCenterRepository(db),
    )


@router.post(
    "",
    response_model=SuccessResponse[OrganizationResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("organization:create"))],
)
async def create_organization(
    payload: OrganizationCreateRequest,
    current_user: User = Depends(get_current_user),
    service: OrganizationService = Depends(get_organization_service),
) -> Any:
    entity = await service.create_organization(
        company_id=current_user.company_id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.get(
    "",
    response_model=SuccessResponse[list[OrganizationResponse]],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def list_organizations(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    effective_date: date | None = Query(default=None),
    sort_by: str | None = Query(default=None),
    sort_order: str = Query(default="asc"),
    current_user: User = Depends(get_current_user),
    service: OrganizationService = Depends(get_organization_service),
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
    response_model=SuccessResponse[OrganizationResponse],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def get_organization(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: OrganizationService = Depends(get_organization_service),
) -> Any:
    entity = await service.repo.get_by_id_with_tenant(current_user.company_id, id)
    if not entity:
        from app.core.exceptions.base import NotFoundException

        raise NotFoundException("ORGANIZATION_NOT_FOUND", "Organization not found")
    return SuccessResponse(data=entity)


@router.put(
    "/{id}",
    response_model=SuccessResponse[OrganizationResponse],
    dependencies=[Depends(PermissionGuard("organization:update"))],
)
async def update_organization(
    id: uuid.UUID,
    payload: OrganizationUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: OrganizationService = Depends(get_organization_service),
) -> Any:
    entity = await service.update_organization(
        company_id=current_user.company_id,
        organization_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.patch(
    "/{id}",
    response_model=SuccessResponse[OrganizationResponse],
    dependencies=[Depends(PermissionGuard("organization:update"))],
)
async def patch_organization(
    id: uuid.UUID,
    payload: OrganizationUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: OrganizationService = Depends(get_organization_service),
) -> Any:
    entity = await service.update_organization(
        company_id=current_user.company_id,
        organization_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(PermissionGuard("organization:delete"))],
)
async def delete_organization(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: OrganizationService = Depends(get_organization_service),
) -> None:
    await service.delete_organization(
        company_id=current_user.company_id,
        organization_id=id,
        actor_id=current_user.id,
    )
    return None
