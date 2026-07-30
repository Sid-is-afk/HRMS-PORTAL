import uuid
from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.promotion.repositories.promotion import PromotionRepository
from app.modules.hr.domains.promotion.schemas.promotion import (
    PromotionCreateRequest,
    PromotionResponse,
)
from app.modules.hr.domains.promotion.services.promotion import PromotionService
from app.modules.hr.domains.timeline.repositories.timeline import (
    AuditTimelineRepository,
)
from app.modules.hr.domains.timeline.schemas.timeline import StateTransitionRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/promotion", tags=["Promotion"])


def get_service(db: AsyncSession = Depends(get_db)) -> PromotionService:
    repo = PromotionRepository(db)
    timeline_repo = AuditTimelineRepository(db)
    timeline_service = AuditTimelineService(timeline_repo)
    return PromotionService(repo, timeline_service)


@router.post(
    "",
    response_model=SuccessResponse[PromotionResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("promotion:create"))],
)
async def create(
    payload: PromotionCreateRequest,
    current_user: User = Depends(get_current_user),
    service: PromotionService = Depends(get_service),
) -> Any:
    entity = await service.create_promotion(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.post(
    "/{id}/transition",
    response_model=SuccessResponse[PromotionResponse],
    dependencies=[Depends(PermissionGuard("promotion:update"))],
)
async def transition(
    id: uuid.UUID,
    payload: StateTransitionRequest,
    current_user: User = Depends(get_current_user),
    service: PromotionService = Depends(get_service),
) -> Any:
    entity = await service.transition_promotion(
        company_id=current_user.company_id,
        promotion_id=id,
        new_state=payload.state,
        actor_id=current_user.id,
        comment=payload.comment,
        reason=payload.reason,
    )
    return SuccessResponse(data=entity)
