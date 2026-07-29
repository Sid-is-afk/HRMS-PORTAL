import logging

from app.modules.employee.domains.profile.events.events import DomainEvent

logger = logging.getLogger("app.events.employee")


async def publish_employee_event(event: DomainEvent) -> None:
    """Publish a domain event. In this sprint, we log to stdout/structured logging.

    Handlers remain placeholders as per requirements.
    """
    logger.info(
        "Domain Event Published: %s",
        event.model_dump_json(),
        extra={
            "event_id": str(event.event_id),
            "event_type": event.event_type,
            "employee_id": str(event.employee_id),
            "company_id": str(event.company_id),
        },
    )
