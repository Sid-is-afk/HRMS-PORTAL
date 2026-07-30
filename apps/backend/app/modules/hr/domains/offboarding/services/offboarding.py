import uuid

from app.core.exceptions.base import BusinessException
from app.events.publishers.hr import publish_hr_event
from app.modules.hr.domains.events import EmployeeOffboarded
from app.modules.hr.domains.offboarding.models.offboarding import Offboarding
from app.modules.hr.domains.offboarding.repositories.offboarding import (
    OffboardingRepository,
)
from app.modules.hr.domains.offboarding.schemas.offboarding import (
    OffboardingCreateRequest,
)
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService


class OffboardingService:
    def __init__(
        self, repo: OffboardingRepository, timeline_service: AuditTimelineService
    ):
        self.repo = repo
        self.timeline_service = timeline_service

    async def get_offboarding(
        self, company_id: uuid.UUID, offboarding_id: uuid.UUID
    ) -> Offboarding:
        res = await self.repo.get_by_id_with_tenant(company_id, offboarding_id)
        if not res:
            raise BusinessException("ENTITY_NOT_FOUND", "Offboarding process not found")
        return res

    async def create_offboarding(
        self, company_id: uuid.UUID, payload: OffboardingCreateRequest
    ) -> Offboarding:
        process = Offboarding(
            company_id=company_id,
            employee_id=payload.employee_id,
            resignation_date=payload.resignation_date,
            workflow_state="Requested",
        )
        return await self.repo.create(process)

    async def transition_offboarding(
        self,
        company_id: uuid.UUID,
        offboarding_id: uuid.UUID,
        new_state: str,
        actor_id: uuid.UUID | None = None,
        comment: str | None = None,
        reason: str | None = None,
    ) -> Offboarding:
        process = await self.get_offboarding(company_id, offboarding_id)
        curr_state = process.workflow_state

        # Workflow: Requested -> Manager Review -> HR Review -> Notice Period -> Clearance -> Completed
        process.workflow_state = new_state
        updated = await self.repo.create(process)

        # Log timeline
        await self.timeline_service.log_transition(
            company_id=company_id,
            entity_type="Offboarding",
            entity_id=offboarding_id,
            previous_state=curr_state,
            new_state=new_state,
            actor_id=actor_id,
            comment=comment,
            reason=reason,
        )

        if new_state == "Completed":
            await publish_hr_event(
                EmployeeOffboarded(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"employee_id": str(process.employee_id)},
                )
            )

        return updated
