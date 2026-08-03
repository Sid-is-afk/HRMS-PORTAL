import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import bypass_outbox_context, current_db_session
from app.database.outbox_repository import OutboxRepository
from app.modules.hr.domains.events import HRDomainEvent

logger = logging.getLogger("app.events.hr")


async def publish_hr_event(
    event: HRDomainEvent, session: AsyncSession | None = None
) -> None:
    """Publish an HR domain event. Writes to Outbox if session is provided/active, otherwise log to structured log."""
    active_session = session or current_db_session.get()
    if active_session is not None and not bypass_outbox_context.get():
        outbox_repo = OutboxRepository(active_session)
        await outbox_repo.save_event(
            event_id=event.event_id,
            event_type=event.event_type,
            tenant_id=event.company_id,
            payload=event.payload,
        )
    else:
        logger.info(
            "HR Domain Event Published: %s",
            event.model_dump_json(),
            extra={
                "event_id": str(event.event_id),
                "event_type": event.event_type,
                "company_id": str(event.company_id),
            },
        )
