import uuid

from app.core.exceptions.base import BusinessException
from app.events.publishers.hr import publish_hr_event
from app.modules.hr.domains.events import PromotionApproved
from app.modules.hr.domains.promotion.models.promotion import Promotion
from app.modules.hr.domains.promotion.repositories.promotion import PromotionRepository
from app.modules.hr.domains.promotion.schemas.promotion import PromotionCreateRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService


class PromotionService:
    def __init__(
        self, repo: PromotionRepository, timeline_service: AuditTimelineService
    ):
        self.repo = repo
        self.timeline_service = timeline_service

    async def get_promotion(
        self, company_id: uuid.UUID, promotion_id: uuid.UUID
    ) -> Promotion:
        res = await self.repo.get_by_id_with_tenant(company_id, promotion_id)
        if not res:
            raise BusinessException("ENTITY_NOT_FOUND", "Promotion request not found")
        return res

    async def create_promotion(
        self, company_id: uuid.UUID, payload: PromotionCreateRequest
    ) -> Promotion:
        request = Promotion(
            company_id=company_id,
            employee_id=payload.employee_id,
            current_designation_id=payload.current_designation_id,
            proposed_designation_id=payload.proposed_designation_id,
            effective_date=payload.effective_date,
            workflow_state="Draft",
        )
        return await self.repo.create(request)

    async def transition_promotion(
        self,
        company_id: uuid.UUID,
        promotion_id: uuid.UUID,
        new_state: str,
        actor_id: uuid.UUID | None = None,
        comment: str | None = None,
        reason: str | None = None,
    ) -> Promotion:
        request = await self.get_promotion(company_id, promotion_id)
        curr_state = request.workflow_state

        # Workflow: Draft -> Submitted -> Approved
        request.workflow_state = new_state
        updated = await self.repo.create(request)

        # Log timeline
        await self.timeline_service.log_transition(
            company_id=company_id,
            entity_type="Promotion",
            entity_id=promotion_id,
            previous_state=curr_state,
            new_state=new_state,
            actor_id=actor_id,
            comment=comment,
            reason=reason,
        )

        if new_state == "Approved":
            await publish_hr_event(
                PromotionApproved(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"employee_id": str(request.employee_id)},
                )
            )

        return updated
