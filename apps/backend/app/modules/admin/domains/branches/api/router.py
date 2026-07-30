import uuid
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.admin.domains.branches.repositories.branch import BranchRepository
from app.modules.admin.domains.branches.schemas.schemas import (
    BranchCreateRequest,
    BranchResponse,
    BranchUpdateRequest,
)
from app.modules.admin.domains.branches.services.branch import BranchService
from app.modules.admin.domains.locations.repositories.location import LocationRepository
from app.modules.admin.domains.organization.repositories.organization import (
    OrganizationRepository,
)
from app.modules.auth.domains.users.models.user import User
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/branches", tags=["Branch"])


def get_branch_service(db: AsyncSession = Depends(get_db)) -> BranchService:
    return BranchService(
        repo=BranchRepository(db),
        org_repo=OrganizationRepository(db),
        loc_repo=LocationRepository(db),
    )


@router.post(
    "",
    response_model=SuccessResponse[BranchResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("organization:create"))],
)
async def create_branch(
    payload: BranchCreateRequest,
    current_user: User = Depends(get_current_user),
    service: BranchService = Depends(get_branch_service),
) -> Any:
    entity = await service.create_branch(
        company_id=current_user.company_id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.get(
    "",
    response_model=SuccessResponse[list[BranchResponse]],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def list_branchs(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    effective_date: date | None = Query(default=None),
    sort_by: str | None = Query(default=None),
    sort_order: str = Query(default="asc"),
    current_user: User = Depends(get_current_user),
    service: BranchService = Depends(get_branch_service),
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
    response_model=SuccessResponse[BranchResponse],
    dependencies=[Depends(PermissionGuard("organization:read"))],
)
async def get_branch(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: BranchService = Depends(get_branch_service),
) -> Any:
    entity = await service.repo.get_by_id_with_tenant(current_user.company_id, id)
    if not entity:
        from app.core.exceptions.base import NotFoundException

        raise NotFoundException("BRANCH_NOT_FOUND", "Branch not found")
    return SuccessResponse(data=entity)


@router.put(
    "/{id}",
    response_model=SuccessResponse[BranchResponse],
    dependencies=[Depends(PermissionGuard("organization:update"))],
)
async def update_branch(
    id: uuid.UUID,
    payload: BranchUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: BranchService = Depends(get_branch_service),
) -> Any:
    entity = await service.update_branch(
        company_id=current_user.company_id,
        branch_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.patch(
    "/{id}",
    response_model=SuccessResponse[BranchResponse],
    dependencies=[Depends(PermissionGuard("organization:update"))],
)
async def patch_branch(
    id: uuid.UUID,
    payload: BranchUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: BranchService = Depends(get_branch_service),
) -> Any:
    entity = await service.update_branch(
        company_id=current_user.company_id,
        branch_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=entity)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(PermissionGuard("organization:delete"))],
)
async def delete_branch(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: BranchService = Depends(get_branch_service),
) -> None:
    await service.delete_branch(
        company_id=current_user.company_id,
        branch_id=id,
        actor_id=current_user.id,
    )
    return None
