import logging

from app.modules.hr.domains.events import HRDomainEvent

logger = logging.getLogger("app.events.hr")


async def publish_hr_event(event: HRDomainEvent) -> None:
    """Publish an HR domain event. In this sprint, we log to structured logging channel.

    Handlers remain placeholders as per requirements.
    """
    logger.info(
        "HR Domain Event Published: %s",
        event.model_dump_json(),
        extra={
            "event_id": str(event.event_id),
            "event_type": event.event_type,
            "company_id": str(event.company_id),
        },
    )
