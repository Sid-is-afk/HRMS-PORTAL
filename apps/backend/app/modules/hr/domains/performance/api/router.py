import uuid
from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.performance.repositories.performance import (
    PerformanceReviewRepository,
)
from app.modules.hr.domains.performance.schemas.performance import (
    PerformanceReviewCreateRequest,
    PerformanceReviewResponse,
)
from app.modules.hr.domains.performance.services.performance import (
    PerformanceReviewService,
)
from app.modules.hr.domains.timeline.repositories.timeline import (
    AuditTimelineRepository,
)
from app.modules.hr.domains.timeline.schemas.timeline import StateTransitionRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/performance", tags=["Performance"])


def get_service(db: AsyncSession = Depends(get_db)) -> PerformanceReviewService:
    repo = PerformanceReviewRepository(db)
    timeline_repo = AuditTimelineRepository(db)
    timeline_service = AuditTimelineService(timeline_repo)
    return PerformanceReviewService(repo, timeline_service)


@router.post(
    "",
    response_model=SuccessResponse[PerformanceReviewResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("performance:create"))],
)
async def create(
    payload: PerformanceReviewCreateRequest,
    current_user: User = Depends(get_current_user),
    service: PerformanceReviewService = Depends(get_service),
) -> Any:
    entity = await service.create_performance(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.post(
    "/{id}/transition",
    response_model=SuccessResponse[PerformanceReviewResponse],
    dependencies=[Depends(PermissionGuard("performance:update"))],
)
async def transition(
    id: uuid.UUID,
    payload: StateTransitionRequest,
    current_user: User = Depends(get_current_user),
    service: PerformanceReviewService = Depends(get_service),
) -> Any:
    entity = await service.transition_performance(
        company_id=current_user.company_id,
        review_id=id,
        new_state=payload.state,
        actor_id=current_user.id,
        comment=payload.comment,
        reason=payload.reason,
    )
    return SuccessResponse(data=entity)
