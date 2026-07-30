import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.shift.models.shift import Shift


class ShiftRepository(BaseRepository[Shift]):
    def __init__(self, session: AsyncSession):
        super().__init__(Shift, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Shift | None:
        stmt = select(Shift).where(
            Shift.id == entity_id,
            Shift.company_id == company_id,
        )
        if hasattr(Shift, "deleted_at"):
            stmt = stmt.where(getattr(Shift, "deleted_at").is_(None))
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
    ) -> tuple[list[Shift], int]:
        stmt = select(Shift).where(
            Shift.company_id == company_id,
        )
        if hasattr(Shift, "deleted_at"):
            stmt = stmt.where(getattr(Shift, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Shift, "workflow_state"):
            stmt = stmt.where(getattr(Shift, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Shift, "employee_id"):
            stmt = stmt.where(getattr(Shift, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Shift, "code"):
                search_conds.append(getattr(Shift, "code").ilike(f"%{search}%"))
            if hasattr(Shift, "title"):
                search_conds.append(getattr(Shift, "title").ilike(f"%{search}%"))
            if hasattr(Shift, "name"):
                search_conds.append(getattr(Shift, "name").ilike(f"%{search}%"))
            if hasattr(Shift, "description"):
                search_conds.append(getattr(Shift, "description").ilike(f"%{search}%"))
            if hasattr(Shift, "feedback"):
                search_conds.append(getattr(Shift, "feedback").ilike(f"%{search}%"))
            if hasattr(Shift, "status"):
                search_conds.append(getattr(Shift, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Shift, key):
                stmt = stmt.where(getattr(Shift, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = Shift.created_at if hasattr(Shift, "created_at") else Shift.id
        if sort_by == "created_date" and hasattr(Shift, "created_at"):
            order_col = getattr(Shift, "created_at")
        elif sort_by == "updated_date" and hasattr(Shift, "updated_at"):
            order_col = getattr(Shift, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Shift, "workflow_state"):
            order_col = getattr(Shift, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Shift, "effective_date"):
            order_col = getattr(Shift, "effective_date")

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
