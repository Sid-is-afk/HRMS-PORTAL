import uuid

from app.core.exceptions.base import BusinessException
from app.events.publishers.hr import publish_hr_event
from app.modules.hr.domains.events import PerformanceCompleted
from app.modules.hr.domains.performance.models.performance import PerformanceReview
from app.modules.hr.domains.performance.repositories.performance import (
    PerformanceReviewRepository,
)
from app.modules.hr.domains.performance.schemas.performance import (
    PerformanceReviewCreateRequest,
)
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService


class PerformanceReviewService:
    def __init__(
        self, repo: PerformanceReviewRepository, timeline_service: AuditTimelineService
    ):
        self.repo = repo
        self.timeline_service = timeline_service

    async def get_performance(
        self, company_id: uuid.UUID, review_id: uuid.UUID
    ) -> PerformanceReview:
        res = await self.repo.get_by_id_with_tenant(company_id, review_id)
        if not res:
            raise BusinessException("ENTITY_NOT_FOUND", "Performance review not found")
        return res

    async def create_performance(
        self, company_id: uuid.UUID, payload: PerformanceReviewCreateRequest
    ) -> PerformanceReview:
        review = PerformanceReview(
            company_id=company_id,
            employee_id=payload.employee_id,
            reviewer_id=payload.reviewer_id,
            rating=payload.rating,
            feedback=payload.feedback,
            workflow_state="Draft",
        )
        return await self.repo.create(review)

    async def transition_performance(
        self,
        company_id: uuid.UUID,
        review_id: uuid.UUID,
        new_state: str,
        actor_id: uuid.UUID | None = None,
        comment: str | None = None,
        reason: str | None = None,
    ) -> PerformanceReview:
        review = await self.get_performance(company_id, review_id)
        curr_state = review.workflow_state

        # Workflow: Draft -> Submitted -> Completed
        review.workflow_state = new_state
        updated = await self.repo.create(review)

        # Log timeline
        await self.timeline_service.log_transition(
            company_id=company_id,
            entity_type="PerformanceReview",
            entity_id=review_id,
            previous_state=curr_state,
            new_state=new_state,
            actor_id=actor_id,
            comment=comment,
            reason=reason,
        )

        if new_state == "Completed":
            await publish_hr_event(
                PerformanceCompleted(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"employee_id": str(review.employee_id)},
                )
            )

        return updated
