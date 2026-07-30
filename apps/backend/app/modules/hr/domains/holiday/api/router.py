from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.holiday.repositories.holiday import HolidayRepository
from app.modules.hr.domains.holiday.schemas.holiday import (
    HolidayCreateRequest,
    HolidayResponse,
)
from app.modules.hr.domains.holiday.services.holiday import HolidayService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/holiday", tags=["Holiday"])


def get_service(db: AsyncSession = Depends(get_db)) -> HolidayService:
    repo = HolidayRepository(db)
    return HolidayService(repo)


@router.post(
    "",
    response_model=SuccessResponse[HolidayResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("holiday:create"))],
)
async def create(
    payload: HolidayCreateRequest,
    current_user: User = Depends(get_current_user),
    service: HolidayService = Depends(get_service),
) -> Any:
    entity = await service.create_holiday(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.get(
    "",
    response_model=SuccessResponse[list[HolidayResponse]],
    dependencies=[Depends(PermissionGuard("holiday:read"))],
)
async def list_holidays(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    service: HolidayService = Depends(get_service),
) -> Any:
    entities, total = await service.repo.get_paginated(
        company_id=current_user.company_id, page=page, size=size
    )
    return SuccessResponse(
        data=entities, metadata={"total": total, "page": page, "size": size}
    )
