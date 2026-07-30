import uuid
from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.onboarding.repositories.onboarding import (
    OnboardingRepository,
)
from app.modules.hr.domains.onboarding.schemas.onboarding import (
    OnboardingCreateRequest,
    OnboardingResponse,
)
from app.modules.hr.domains.onboarding.services.onboarding import OnboardingService
from app.modules.hr.domains.timeline.repositories.timeline import (
    AuditTimelineRepository,
)
from app.modules.hr.domains.timeline.schemas.timeline import StateTransitionRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


def get_service(db: AsyncSession = Depends(get_db)) -> OnboardingService:
    repo = OnboardingRepository(db)
    timeline_repo = AuditTimelineRepository(db)
    timeline_service = AuditTimelineService(timeline_repo)
    return OnboardingService(repo, timeline_service)


@router.post(
    "",
    response_model=SuccessResponse[OnboardingResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("recruitment:create"))],
)
async def create(
    payload: OnboardingCreateRequest,
    current_user: User = Depends(get_current_user),
    service: OnboardingService = Depends(get_service),
) -> Any:
    entity = await service.create_onboarding(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.post(
    "/{id}/transition",
    response_model=SuccessResponse[OnboardingResponse],
    dependencies=[Depends(PermissionGuard("recruitment:update"))],
)
async def transition(
    id: uuid.UUID,
    payload: StateTransitionRequest,
    current_user: User = Depends(get_current_user),
    service: OnboardingService = Depends(get_service),
) -> Any:
    entity = await service.transition_onboarding(
        company_id=current_user.company_id,
        onboarding_id=id,
        new_state=payload.state,
        actor_id=current_user.id,
        comment=payload.comment,
        reason=payload.reason,
    )
    return SuccessResponse(data=entity)
