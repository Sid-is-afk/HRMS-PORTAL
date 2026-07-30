import uuid

from app.modules.hr.domains.timeline.models.timeline import AuditTimeline
from app.modules.hr.domains.timeline.repositories.timeline import (
    AuditTimelineRepository,
)


class AuditTimelineService:
    def __init__(self, repo: AuditTimelineRepository):
        self.repo = repo

    async def log_transition(
        self,
        company_id: uuid.UUID,
        entity_type: str,
        entity_id: uuid.UUID,
        previous_state: str,
        new_state: str,
        actor_id: uuid.UUID | None = None,
        comment: str | None = None,
        reason: str | None = None,
    ) -> AuditTimeline:
        timeline = AuditTimeline(
            company_id=company_id,
            entity_type=entity_type,
            entity_id=entity_id,
            previous_state=previous_state,
            new_state=new_state,
            actor_id=actor_id,
            comment=comment,
            reason=reason,
        )
        return await self.repo.create(timeline)
