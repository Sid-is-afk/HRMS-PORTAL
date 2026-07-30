import uuid
from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.offboarding.repositories.offboarding import (
    OffboardingRepository,
)
from app.modules.hr.domains.offboarding.schemas.offboarding import (
    OffboardingCreateRequest,
    OffboardingResponse,
)
from app.modules.hr.domains.offboarding.services.offboarding import OffboardingService
from app.modules.hr.domains.timeline.repositories.timeline import (
    AuditTimelineRepository,
)
from app.modules.hr.domains.timeline.schemas.timeline import StateTransitionRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/offboarding", tags=["Offboarding"])


def get_service(db: AsyncSession = Depends(get_db)) -> OffboardingService:
    repo = OffboardingRepository(db)
    timeline_repo = AuditTimelineRepository(db)
    timeline_service = AuditTimelineService(timeline_repo)
    return OffboardingService(repo, timeline_service)


@router.post(
    "",
    response_model=SuccessResponse[OffboardingResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("recruitment:create"))],
)
async def create(
    payload: OffboardingCreateRequest,
    current_user: User = Depends(get_current_user),
    service: OffboardingService = Depends(get_service),
) -> Any:
    entity = await service.create_offboarding(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.post(
    "/{id}/transition",
    response_model=SuccessResponse[OffboardingResponse],
    dependencies=[Depends(PermissionGuard("recruitment:update"))],
)
async def transition(
    id: uuid.UUID,
    payload: StateTransitionRequest,
    current_user: User = Depends(get_current_user),
    service: OffboardingService = Depends(get_service),
) -> Any:
    entity = await service.transition_offboarding(
        company_id=current_user.company_id,
        offboarding_id=id,
        new_state=payload.state,
        actor_id=current_user.id,
        comment=payload.comment,
        reason=payload.reason,
    )
    return SuccessResponse(data=entity)
