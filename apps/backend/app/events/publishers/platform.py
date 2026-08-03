import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import bypass_outbox_context, current_db_session
from app.database.outbox_repository import OutboxRepository
from app.modules.platform.domains.events import PlatformDomainEvent

logger = logging.getLogger("app.events.platform")


async def publish_platform_event(
    event: PlatformDomainEvent, session: AsyncSession | None = None
) -> None:
    """Publish a Platform domain event by writing to Outbox if session is provided/active, otherwise log it."""
    active_session = session or current_db_session.get()
    if active_session is not None and not bypass_outbox_context.get():
        outbox_repo = OutboxRepository(active_session)
        await outbox_repo.save_event(
            event_id=event.event_id,
            event_type=event.event_type,
            tenant_id=event.tenant_id,
            payload=event.payload,
        )
    else:
        logger.info(
            "Platform Domain Event Published: %s",
            event.model_dump_json(),
            extra={
                "event_id": str(event.event_id),
                "event_type": event.event_type,
                "tenant_id": str(event.tenant_id),
            },
        )
