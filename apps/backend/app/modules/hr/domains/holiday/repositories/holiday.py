import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.holiday.models.holiday import Holiday


class HolidayRepository(BaseRepository[Holiday]):
    def __init__(self, session: AsyncSession):
        super().__init__(Holiday, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Holiday | None:
        stmt = select(Holiday).where(
            Holiday.id == entity_id,
            Holiday.company_id == company_id,
        )
        if hasattr(Holiday, "deleted_at"):
            stmt = stmt.where(getattr(Holiday, "deleted_at").is_(None))
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
    ) -> tuple[list[Holiday], int]:
        stmt = select(Holiday).where(
            Holiday.company_id == company_id,
        )
        if hasattr(Holiday, "deleted_at"):
            stmt = stmt.where(getattr(Holiday, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Holiday, "workflow_state"):
            stmt = stmt.where(getattr(Holiday, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Holiday, "employee_id"):
            stmt = stmt.where(getattr(Holiday, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Holiday, "code"):
                search_conds.append(getattr(Holiday, "code").ilike(f"%{search}%"))
            if hasattr(Holiday, "title"):
                search_conds.append(getattr(Holiday, "title").ilike(f"%{search}%"))
            if hasattr(Holiday, "name"):
                search_conds.append(getattr(Holiday, "name").ilike(f"%{search}%"))
            if hasattr(Holiday, "description"):
                search_conds.append(
                    getattr(Holiday, "description").ilike(f"%{search}%")
                )
            if hasattr(Holiday, "feedback"):
                search_conds.append(getattr(Holiday, "feedback").ilike(f"%{search}%"))
            if hasattr(Holiday, "status"):
                search_conds.append(getattr(Holiday, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Holiday, key):
                stmt = stmt.where(getattr(Holiday, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            Holiday.created_at if hasattr(Holiday, "created_at") else Holiday.id
        )
        if sort_by == "created_date" and hasattr(Holiday, "created_at"):
            order_col = getattr(Holiday, "created_at")
        elif sort_by == "updated_date" and hasattr(Holiday, "updated_at"):
            order_col = getattr(Holiday, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Holiday, "workflow_state"):
            order_col = getattr(Holiday, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Holiday, "effective_date"):
            order_col = getattr(Holiday, "effective_date")

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
