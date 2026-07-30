import uuid
from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.training.repositories.training import TrainingRepository
from app.modules.hr.domains.training.schemas.training import (
    TrainingCreateRequest,
    TrainingResponse,
)
from app.modules.hr.domains.training.services.training import TrainingService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/training", tags=["Training"])


def get_service(db: AsyncSession = Depends(get_db)) -> TrainingService:
    repo = TrainingRepository(db)
    return TrainingService(repo)


@router.post(
    "",
    response_model=SuccessResponse[TrainingResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("training:create"))],
)
async def create(
    payload: TrainingCreateRequest,
    current_user: User = Depends(get_current_user),
    service: TrainingService = Depends(get_service),
) -> Any:
    entity = await service.create_training(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.post(
    "/{id}/complete",
    response_model=SuccessResponse[TrainingResponse],
    dependencies=[Depends(PermissionGuard("training:update"))],
)
async def complete(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: TrainingService = Depends(get_service),
) -> Any:
    entity = await service.complete_training(
        current_user.company_id, id, actor_id=current_user.id
    )
    return SuccessResponse(data=entity)
