import logging

from app.modules.admin.domains.organization.events.events import AdminDomainEvent

logger = logging.getLogger("app.events.admin")


async def publish_admin_event(event: AdminDomainEvent) -> None:
    """Publish an admin domain event. In this sprint, we log to stdout/structured logging.

    Handlers remain placeholders as per requirements.
    """
    logger.info(
        "Admin Domain Event Published: %s",
        event.model_dump_json(),
        extra={
            "event_id": str(event.event_id),
            "event_type": event.event_type,
            "company_id": str(event.company_id),
        },
    )
