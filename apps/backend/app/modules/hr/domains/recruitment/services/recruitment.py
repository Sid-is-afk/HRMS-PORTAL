import uuid

from app.core.exceptions.base import BusinessException
from app.events.publishers.hr import publish_hr_event
from app.modules.hr.domains.events import (
    CandidateInterviewScheduled,
    OfferAccepted,
    OfferReleased,
    RecruitmentPublished,
)
from app.modules.hr.domains.recruitment.models.candidate import Candidate
from app.modules.hr.domains.recruitment.models.interview import Interview
from app.modules.hr.domains.recruitment.models.offer import Offer
from app.modules.hr.domains.recruitment.models.recruitment import Recruitment
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
)
from app.modules.hr.domains.recruitment.schemas.interview import (
    InterviewCreateRequest,
)
from app.modules.hr.domains.recruitment.schemas.offer import (
    OfferCreateRequest,
)
from app.modules.hr.domains.recruitment.schemas.recruitment import (
    RecruitmentCreateRequest,
)
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService


class RecruitmentService:
    def __init__(
        self,
        job_repo: RecruitmentRepository,
        candidate_repo: CandidateRepository,
        interview_repo: InterviewRepository,
        offer_repo: OfferRepository,
        timeline_service: AuditTimelineService,
    ):
        self.job_repo = job_repo
        self.candidate_repo = candidate_repo
        self.interview_repo = interview_repo
        self.offer_repo = offer_repo
        self.timeline_service = timeline_service

    # Job Openings
    async def get_job_opening(
        self, company_id: uuid.UUID, job_id: uuid.UUID
    ) -> Recruitment:
        res = await self.job_repo.get_by_id_with_tenant(company_id, job_id)
        if not res:
            raise BusinessException("ENTITY_NOT_FOUND", "Job opening not found")
        return res

    async def create_job_opening(
        self, company_id: uuid.UUID, payload: RecruitmentCreateRequest
    ) -> Recruitment:
        job = Recruitment(
            company_id=company_id,
            title=payload.title,
            department_id=payload.department_id,
            workflow_state="Draft",
        )
        return await self.job_repo.create(job)

    async def transition_job_opening(
        self,
        company_id: uuid.UUID,
        job_id: uuid.UUID,
        new_state: str,
        actor_id: uuid.UUID | None = None,
        comment: str | None = None,
        reason: str | None = None,
    ) -> Recruitment:
        job = await self.get_job_opening(company_id, job_id)
        curr_state = job.workflow_state

        # Workflow: Draft -> Published -> Applications Received -> Screening -> Interview -> Offer Released -> Accepted -> Joined -> Closed
        # For simplicity, allow any chronological forward transition
        job.workflow_state = new_state
        updated = await self.job_repo.create(job)

        # Log timeline
        await self.timeline_service.log_transition(
            company_id=company_id,
            entity_type="JobOpening",
            entity_id=job_id,
            previous_state=curr_state,
            new_state=new_state,
            actor_id=actor_id,
            comment=comment,
            reason=reason,
        )

        if new_state == "Published":
            await publish_hr_event(
                RecruitmentPublished(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"job_opening_id": str(job_id)},
                )
            )

        return updated

    # Candidates
    async def create_candidate(
        self, company_id: uuid.UUID, payload: CandidateCreateRequest
    ) -> Candidate:
        candidate = Candidate(
            company_id=company_id,
            job_opening_id=payload.job_opening_id,
            first_name=payload.first_name,
            last_name=payload.last_name,
            email=payload.email,
            status=payload.status,
        )
        return await self.candidate_repo.create(candidate)

    # Interviews
    async def create_interview(
        self,
        company_id: uuid.UUID,
        payload: InterviewCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Interview:
        interview = Interview(
            company_id=company_id,
            candidate_id=payload.candidate_id,
            interviewer_id=payload.interviewer_id,
            interview_date=payload.interview_date,
            feedback=payload.feedback,
            rating=payload.rating,
        )
        saved = await self.interview_repo.create(interview)
        await publish_hr_event(
            CandidateInterviewScheduled(
                company_id=company_id,
                actor_id=actor_id,
                payload={"candidate_id": str(payload.candidate_id)},
            )
        )
        return saved

    # Offers
    async def create_offer(
        self,
        company_id: uuid.UUID,
        payload: OfferCreateRequest,
        actor_id: uuid.UUID | None = None,
    ) -> Offer:
        offer = Offer(
            company_id=company_id,
            candidate_id=payload.candidate_id,
            offered_position_id=payload.offered_position_id,
            salary=payload.salary,
            joining_date=payload.joining_date,
            status="Pending",
        )
        saved = await self.offer_repo.create(offer)
        await publish_hr_event(
            OfferReleased(
                company_id=company_id,
                actor_id=actor_id,
                payload={"candidate_id": str(payload.candidate_id)},
            )
        )
        return saved

    async def accept_offer(
        self,
        company_id: uuid.UUID,
        offer_id: uuid.UUID,
        actor_id: uuid.UUID | None = None,
    ) -> Offer:
        offer = await self.offer_repo.get_by_id_with_tenant(company_id, offer_id)
        if not offer:
            raise BusinessException("ENTITY_NOT_FOUND", "Offer not found")
        offer.status = "Accepted"
        updated = await self.offer_repo.create(offer)
        await publish_hr_event(
            OfferAccepted(
                company_id=company_id,
                actor_id=actor_id,
                payload={"offer_id": str(offer_id)},
            )
        )
        return updated
