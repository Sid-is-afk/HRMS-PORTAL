import uuid

from app.core.exceptions.base import BusinessException
from app.events.publishers.hr import publish_hr_event
from app.modules.hr.domains.events import TransferApproved
from app.modules.hr.domains.timeline.services.timeline import AuditTimelineService
from app.modules.hr.domains.transfer.models.transfer import Transfer
from app.modules.hr.domains.transfer.repositories.transfer import TransferRepository
from app.modules.hr.domains.transfer.schemas.transfer import TransferCreateRequest


class TransferService:
    def __init__(
        self, repo: TransferRepository, timeline_service: AuditTimelineService
    ):
        self.repo = repo
        self.timeline_service = timeline_service

    async def get_transfer(
        self, company_id: uuid.UUID, transfer_id: uuid.UUID
    ) -> Transfer:
        res = await self.repo.get_by_id_with_tenant(company_id, transfer_id)
        if not res:
            raise BusinessException("ENTITY_NOT_FOUND", "Transfer request not found")
        return res

    async def create_transfer(
        self, company_id: uuid.UUID, payload: TransferCreateRequest
    ) -> Transfer:
        request = Transfer(
            company_id=company_id,
            employee_id=payload.employee_id,
            current_department_id=payload.current_department_id,
            proposed_department_id=payload.proposed_department_id,
            proposed_manager_id=payload.proposed_manager_id,
            effective_date=payload.effective_date,
            workflow_state="Draft",
        )
        return await self.repo.create(request)

    async def transition_transfer(
        self,
        company_id: uuid.UUID,
        transfer_id: uuid.UUID,
        new_state: str,
        actor_id: uuid.UUID | None = None,
        comment: str | None = None,
        reason: str | None = None,
    ) -> Transfer:
        request = await self.get_transfer(company_id, transfer_id)
        curr_state = request.workflow_state

        # Workflow: Draft -> Submitted -> Approved
        request.workflow_state = new_state
        updated = await self.repo.create(request)

        # Log timeline
        await self.timeline_service.log_transition(
            company_id=company_id,
            entity_type="Transfer",
            entity_id=transfer_id,
            previous_state=curr_state,
            new_state=new_state,
            actor_id=actor_id,
            comment=comment,
            reason=reason,
        )

        if new_state == "Approved":
            await publish_hr_event(
                TransferApproved(
                    company_id=company_id,
                    actor_id=actor_id,
                    payload={"employee_id": str(request.employee_id)},
                )
            )

        return updated
