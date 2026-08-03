import uuid
from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.core.middleware.idempotency import IdempotencyChecker
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.timeline.repositories.timeline import (
    AuditTimelineRepository,
)
from app.modules.hr.domains.timeline.schemas.timeline import StateTransitionRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService
from app.modules.hr.domains.transfer.repositories.transfer import TransferRepository
from app.modules.hr.domains.transfer.schemas.transfer import (
    TransferCreateRequest,
    TransferResponse,
)
from app.modules.hr.domains.transfer.services.transfer import TransferService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/transfer", tags=["Transfer"])


def get_service(db: AsyncSession = Depends(get_db)) -> TransferService:
    repo = TransferRepository(db)
    timeline_repo = AuditTimelineRepository(db)
    timeline_service = AuditTimelineService(timeline_repo)
    return TransferService(repo, timeline_service)


@router.post(
    "",
    response_model=SuccessResponse[TransferResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[
        Depends(PermissionGuard("transfer:create")),
        Depends(IdempotencyChecker()),
    ],
)
async def create(
    payload: TransferCreateRequest,
    current_user: User = Depends(get_current_user),
    service: TransferService = Depends(get_service),
) -> Any:
    entity = await service.create_transfer(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.post(
    "/{id}/transition",
    response_model=SuccessResponse[TransferResponse],
    dependencies=[Depends(PermissionGuard("transfer:update"))],
)
async def transition(
    id: uuid.UUID,
    payload: StateTransitionRequest,
    current_user: User = Depends(get_current_user),
    service: TransferService = Depends(get_service),
) -> Any:
    entity = await service.transition_transfer(
        company_id=current_user.company_id,
        transfer_id=id,
        new_state=payload.state,
        actor_id=current_user.id,
        comment=payload.comment,
        reason=payload.reason,
    )
    return SuccessResponse(data=entity)
