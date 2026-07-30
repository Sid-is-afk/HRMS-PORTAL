import uuid

from app.core.exceptions.base import BusinessException
from app.events.publishers.hr import publish_hr_event
from app.modules.hr.domains.events import EmployeeOnboarded
from app.modules.hr.domains.onboarding.models.onboarding import Onboarding
from app.modules.hr.domains.onboarding.repositories.onboarding import (
    OnboardingRepository,
)
from app.modules.hr.domains.onboarding.schemas.onboarding import OnboardingCreateRequest
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService


class OnboardingService:
    def __init__(
        self, repo: OnboardingRepository, timeline_service: AuditTimelineService
    ):
        self.repo = repo
        self.timeline_service = timeline_service

    async def get_onboarding(
        self, company_id: uuid.UUID, onboarding_id: uuid.UUID
    ) -> Onboarding:
        res = await self.repo.get_by_id_with_tenant(company_id, onboarding_id)
        if not res:
            raise BusinessException("ENTITY_NOT_FOUND", "Onboarding process not found")
        return res

    async def create_onboarding(
        self, company_id: uuid.UUID, payload: OnboardingCreateRequest
    ) -> Onboarding:
        process = Onboarding(
            company_id=company_id,
            employee_id=payload.employee_id,
            buddy_id=payload.buddy_id,
            workflow_state="Created",
        )
        return await self.repo.create(process)

    async def transition_onboarding(
        self,
        company_id: uuid.UUID,
        onboarding_id: uuid.UUID,
        new_state: str,
        actor_id: uuid.UUID | None = None,
        comment: str | None = None,
        reason: str | None = None,
    ) -> Onboarding:
        process = await self.get_onboarding(company_id, onboarding_id)
        curr_state = process.workflow_state

        # Workflow: Created -> Documents Pending -> Verified -> In Progress -> Completed
        process.workflow_state = new_state
        updated = await self.repo.create(process)

        # Log timeline
        await self.timeline_service.log_transition(
            company_id=company_id,
            entity_type="Onboarding",
            entity_id=onboarding_id,
            previous_state=curr_state,
            new_state=new_state,
            actor_id=actor_id,
            comment=comment,
            reason=reason,
        )

        if new_state == "Completed":
            await publish_hr_event(
                EmployeeOnboarded(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"employee_id": str(process.employee_id)},
                )
            )

        return updated
