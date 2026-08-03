import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.outbox import OutboxEvent
from app.database.repository import BaseRepository


class OutboxRepository(BaseRepository[OutboxEvent]):
    def __init__(self, session: AsyncSession):
        super().__init__(OutboxEvent, session)

    async def save_event(
        self,
        event_id: uuid.UUID,
        event_type: str,
        tenant_id: uuid.UUID | None,
        payload: dict[str, Any],
    ) -> OutboxEvent:
        outbox_event = OutboxEvent(
            event_id=event_id,
            event_type=event_type,
            tenant_id=tenant_id,
            payload=payload,
            status="Pending",
        )
        return await self.create(outbox_event)

    async def get_pending_events(self, limit: int = 50) -> list[OutboxEvent]:
        # Always bypass tenant context when retrieving platform global outbox events!
        from app.modules.platform.domains.context_vars import bypass_tenant_context

        token = bypass_tenant_context.set(True)
        try:
            stmt = (
                select(OutboxEvent)
                .where(OutboxEvent.status == "Pending")
                .order_by(OutboxEvent.created_at.asc())
                .limit(limit)
            )
            res = await self.session.execute(stmt)
            return list(res.scalars().all())
        finally:
            bypass_tenant_context.reset(token)

    async def mark_as_processed(self, event_id: uuid.UUID) -> None:
        from app.modules.platform.domains.context_vars import bypass_tenant_context

        token = bypass_tenant_context.set(True)
        try:
            stmt = select(OutboxEvent).where(OutboxEvent.event_id == event_id)
            res = await self.session.execute(stmt)
            event = res.scalars().first()
            if event:
                event.status = "Processed"
                event.processed_at = datetime.now()
                await self.create(event)
        finally:
            bypass_tenant_context.reset(token)

    async def mark_as_failed(self, event_id: uuid.UUID, error_message: str) -> None:
        from app.modules.platform.domains.context_vars import bypass_tenant_context

        token = bypass_tenant_context.set(True)
        try:
            stmt = select(OutboxEvent).where(OutboxEvent.event_id == event_id)
            res = await self.session.execute(stmt)
            event = res.scalars().first()
            if event:
                event.status = "Failed"
                event.retry_count += 1
                event.error_message = error_message[:250]
                await self.create(event)
        finally:
            bypass_tenant_context.reset(token)
