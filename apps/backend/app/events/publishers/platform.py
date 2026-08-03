import logging

from app.modules.platform.domains.events import PlatformDomainEvent

logger = logging.getLogger("app.events.platform")


async def publish_platform_event(event: PlatformDomainEvent) -> None:
    """Publish a Platform domain event by logging it to structured channel."""
    logger.info(
        "Platform Domain Event Published: %s",
        event.model_dump_json(),
        extra={
            "event_id": str(event.event_id),
            "event_type": event.event_type,
            "tenant_id": str(event.tenant_id),
        },
    )
