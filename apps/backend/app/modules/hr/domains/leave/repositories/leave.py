import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.leave.models.leave import Leave


class LeaveRepository(BaseRepository[Leave]):
    def __init__(self, session: AsyncSession):
        super().__init__(Leave, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Leave | None:
        stmt = select(Leave).where(
            Leave.id == entity_id,
            Leave.company_id == company_id,
        )
        if hasattr(Leave, "deleted_at"):
            stmt = stmt.where(getattr(Leave, "deleted_at").is_(None))
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
    ) -> tuple[list[Leave], int]:
        stmt = select(Leave).where(
            Leave.company_id == company_id,
        )
        if hasattr(Leave, "deleted_at"):
            stmt = stmt.where(getattr(Leave, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Leave, "workflow_state"):
            stmt = stmt.where(getattr(Leave, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Leave, "employee_id"):
            stmt = stmt.where(getattr(Leave, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Leave, "code"):
                search_conds.append(getattr(Leave, "code").ilike(f"%{search}%"))
            if hasattr(Leave, "title"):
                search_conds.append(getattr(Leave, "title").ilike(f"%{search}%"))
            if hasattr(Leave, "name"):
                search_conds.append(getattr(Leave, "name").ilike(f"%{search}%"))
            if hasattr(Leave, "description"):
                search_conds.append(getattr(Leave, "description").ilike(f"%{search}%"))
            if hasattr(Leave, "feedback"):
                search_conds.append(getattr(Leave, "feedback").ilike(f"%{search}%"))
            if hasattr(Leave, "status"):
                search_conds.append(getattr(Leave, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Leave, key):
                stmt = stmt.where(getattr(Leave, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = Leave.created_at if hasattr(Leave, "created_at") else Leave.id
        if sort_by == "created_date" and hasattr(Leave, "created_at"):
            order_col = getattr(Leave, "created_at")
        elif sort_by == "updated_date" and hasattr(Leave, "updated_at"):
            order_col = getattr(Leave, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Leave, "workflow_state"):
            order_col = getattr(Leave, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Leave, "effective_date"):
            order_col = getattr(Leave, "effective_date")

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
