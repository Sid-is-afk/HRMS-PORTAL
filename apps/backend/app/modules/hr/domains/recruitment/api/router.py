import uuid
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.hr.domains.recruitment.repositories.candidate import (
    CandidateRepository,
)
from app.modules.hr.domains.recruitment.repositories.interview import (
    InterviewRepository,
)
from app.modules.hr.domains.recruitment.repositories.offer import OfferRepository
from app.modules.hr.domains.recruitment.repositories.recruitment import (
    RecruitmentRepository,
)
from app.modules.hr.domains.recruitment.schemas.candidate import (
    CandidateCreateRequest,
    CandidateResponse,
)
from app.modules.hr.domains.recruitment.schemas.interview import (
    InterviewCreateRequest,
    InterviewResponse,
)
from app.modules.hr.domains.recruitment.schemas.offer import (
    OfferCreateRequest,
    OfferResponse,
)
from app.modules.hr.domains.recruitment.schemas.recruitment import (
    RecruitmentCreateRequest,
    RecruitmentResponse,
)
from app.modules.hr.domains.recruitment.services.recruitment import RecruitmentService
from app.modules.hr.domains.timeline.repositories.timeline import (
    AuditTimelineRepository,
)
from app.modules.hr.domains.timeline.schemas.timeline import StateTransitionRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/recruitment", tags=["Recruitment"])


def get_service(db: AsyncSession = Depends(get_db)) -> RecruitmentService:
    job_repo = RecruitmentRepository(db)
    candidate_repo = CandidateRepository(db)
    interview_repo = InterviewRepository(db)
    offer_repo = OfferRepository(db)
    timeline_repo = AuditTimelineRepository(db)
    timeline_service = AuditTimelineService(timeline_repo)
    return RecruitmentService(
        job_repo, candidate_repo, interview_repo, offer_repo, timeline_service
    )


# Job Openings
@router.post(
    "/jobs",
    response_model=SuccessResponse[RecruitmentResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("recruitment:create"))],
)
async def create_job(
    payload: RecruitmentCreateRequest,
    current_user: User = Depends(get_current_user),
    service: RecruitmentService = Depends(get_service),
) -> Any:
    entity = await service.create_job_opening(current_user.company_id, payload)
    return SuccessResponse(data=entity)


@router.get(
    "/jobs",
    response_model=SuccessResponse[list[RecruitmentResponse]],
    dependencies=[Depends(PermissionGuard("recruitment:read"))],
)
async def list_jobs(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    service: RecruitmentService = Depends(get_service),
) -> Any:
    entities, total = await service.job_repo.get_paginated(
        company_id=current_user.company_id, page=page, size=size
    )
    return SuccessResponse(
        data=entities, metadata={"total": total, "page": page, "size": size}
    )


@router.post(
    "/jobs/{id}/transition",
    response_model=SuccessResponse[RecruitmentResponse],
    dependencies=[Depends(PermissionGuard("recruitment:update"))],
)
async def transition_job(
    id: uuid.UUID,
    payload: StateTransitionRequest,
    current_user: User = Depends(get_current_user),
    service: RecruitmentService = Depends(get_service),
) -> Any:
    entity = await service.transition_job_opening(
        company_id=current_user.company_id,
        job_id=id,
        new_state=payload.state,
        actor_id=current_user.id,
        comment=payload.comment,
        reason=payload.reason,
    )
    return SuccessResponse(data=entity)


# Candidates
@router.post(
    "/candidates",
    response_model=SuccessResponse[CandidateResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("recruitment:create"))],
)
async def create_candidate(
    payload: CandidateCreateRequest,
    current_user: User = Depends(get_current_user),
    service: RecruitmentService = Depends(get_service),
) -> Any:
    entity = await service.create_candidate(current_user.company_id, payload)
    return SuccessResponse(data=entity)


# Interviews
@router.post(
    "/interviews",
    response_model=SuccessResponse[InterviewResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("recruitment:create"))],
)
async def create_interview(
    payload: InterviewCreateRequest,
    current_user: User = Depends(get_current_user),
    service: RecruitmentService = Depends(get_service),
) -> Any:
    entity = await service.create_interview(
        current_user.company_id, payload, actor_id=current_user.id
    )
    return SuccessResponse(data=entity)


# Offers
@router.post(
    "/offers",
    response_model=SuccessResponse[OfferResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(PermissionGuard("recruitment:create"))],
)
async def create_offer(
    payload: OfferCreateRequest,
    current_user: User = Depends(get_current_user),
    service: RecruitmentService = Depends(get_service),
) -> Any:
    entity = await service.create_offer(
        current_user.company_id, payload, actor_id=current_user.id
    )
    return SuccessResponse(data=entity)


@router.post(
    "/offers/{id}/accept",
    response_model=SuccessResponse[OfferResponse],
    dependencies=[Depends(PermissionGuard("recruitment:update"))],
)
async def accept_offer(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RecruitmentService = Depends(get_service),
) -> Any:
    entity = await service.accept_offer(
        current_user.company_id, id, actor_id=current_user.id
    )
    return SuccessResponse(data=entity)
