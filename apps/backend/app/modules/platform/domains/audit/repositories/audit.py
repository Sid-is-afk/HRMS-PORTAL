import uuid
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.platform.domains.audit.models.audit import PlatformAudit


class PlatformAuditRepository(BaseRepository[PlatformAudit]):
    def __init__(self, session: AsyncSession):
        super().__init__(PlatformAudit, session)

    async def get_paginated(
        self,
        page: int,
        size: int,
        tenant_id: uuid.UUID | None = None,
        actor_id: uuid.UUID | None = None,
        action: str | None = None,
        sort_by: str | None = None,
        sort_order: str = "desc",
        **filters: Any,
    ) -> tuple[list[PlatformAudit], int]:
        stmt = select(PlatformAudit)

        # Filters
        if tenant_id:
            stmt = stmt.where(PlatformAudit.tenant_id == tenant_id)
        if actor_id:
            stmt = stmt.where(PlatformAudit.actor_id == actor_id)
        if action:
            stmt = stmt.where(PlatformAudit.action == action)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_res = await self.session.execute(count_stmt)
        total_records = count_res.scalar() or 0

        # Sorting
        order_col: Any = PlatformAudit.created_at
        if sort_order == "desc":
            stmt = stmt.order_by(order_col.desc())
        else:
            stmt = stmt.order_by(order_col.asc())

        # Pagination
        offset = (page - 1) * size
        stmt = stmt.offset(offset).limit(size)

        res = await self.session.execute(stmt)
        entities = list(res.scalars().all())
        return entities, total_records
