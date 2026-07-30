import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.timeline.models.timeline import AuditTimeline


class AuditTimelineRepository(BaseRepository[AuditTimeline]):
    def __init__(self, session: AsyncSession):
        super().__init__(AuditTimeline, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> AuditTimeline | None:
        stmt = select(AuditTimeline).where(
            AuditTimeline.id == entity_id,
            AuditTimeline.company_id == company_id,
        )
        if hasattr(AuditTimeline, "deleted_at"):
            stmt = stmt.where(getattr(AuditTimeline, "deleted_at").is_(None))
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_paginated(
        self,
        company_id: uuid.UUID,
        page: int,
        size: int,
        search: str | None = None,
        workflow_state: str | None = None,
        employee_id: uuid.UUID | None = None,
        sort_by: str | None = None,
        sort_order: str = "asc",
        **filters: Any,
    ) -> tuple[list[AuditTimeline], int]:
        stmt = select(AuditTimeline).where(
            AuditTimeline.company_id == company_id,
        )
        if hasattr(AuditTimeline, "deleted_at"):
            stmt = stmt.where(getattr(AuditTimeline, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(AuditTimeline, "workflow_state"):
            stmt = stmt.where(
                getattr(AuditTimeline, "workflow_state") == workflow_state
            )

        # Employee filter
        if employee_id is not None and hasattr(AuditTimeline, "employee_id"):
            stmt = stmt.where(getattr(AuditTimeline, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(AuditTimeline, "code"):
                search_conds.append(getattr(AuditTimeline, "code").ilike(f"%{search}%"))
            if hasattr(AuditTimeline, "title"):
                search_conds.append(
                    getattr(AuditTimeline, "title").ilike(f"%{search}%")
                )
            if hasattr(AuditTimeline, "name"):
                search_conds.append(getattr(AuditTimeline, "name").ilike(f"%{search}%"))
            if hasattr(AuditTimeline, "description"):
                search_conds.append(
                    getattr(AuditTimeline, "description").ilike(f"%{search}%")
                )
            if hasattr(AuditTimeline, "feedback"):
                search_conds.append(
                    getattr(AuditTimeline, "feedback").ilike(f"%{search}%")
                )
            if hasattr(AuditTimeline, "status"):
                search_conds.append(
                    getattr(AuditTimeline, "status").ilike(f"%{search}%")
                )
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(AuditTimeline, key):
                stmt = stmt.where(getattr(AuditTimeline, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            AuditTimeline.created_at
            if hasattr(AuditTimeline, "created_at")
            else AuditTimeline.id
        )
        if sort_by == "created_date" and hasattr(AuditTimeline, "created_at"):
            order_col = getattr(AuditTimeline, "created_at")
        elif sort_by == "updated_date" and hasattr(AuditTimeline, "updated_at"):
            order_col = getattr(AuditTimeline, "updated_at")
        elif sort_by == "workflow_state" and hasattr(AuditTimeline, "workflow_state"):
            order_col = getattr(AuditTimeline, "workflow_state")
        elif sort_by == "effective_date" and hasattr(AuditTimeline, "effective_date"):
            order_col = getattr(AuditTimeline, "effective_date")

        if sort_order == "desc":
            stmt = stmt.order_by(order_col.desc())
        else:
            stmt = stmt.order_by(order_col.asc())

        # Pagination
        offset = (page - 1) * size
        stmt = stmt.offset(offset).limit(size)

        result = await self.session.execute(stmt)
        entities = list(result.scalars().all())

        return entities, total_records
