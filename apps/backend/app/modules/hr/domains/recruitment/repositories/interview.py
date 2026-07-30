import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.recruitment.models.interview import Interview


class InterviewRepository(BaseRepository[Interview]):
    def __init__(self, session: AsyncSession):
        super().__init__(Interview, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Interview | None:
        stmt = select(Interview).where(
            Interview.id == entity_id,
            Interview.company_id == company_id,
        )
        if hasattr(Interview, "deleted_at"):
            stmt = stmt.where(getattr(Interview, "deleted_at").is_(None))
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
    ) -> tuple[list[Interview], int]:
        stmt = select(Interview).where(
            Interview.company_id == company_id,
        )
        if hasattr(Interview, "deleted_at"):
            stmt = stmt.where(getattr(Interview, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Interview, "workflow_state"):
            stmt = stmt.where(getattr(Interview, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Interview, "employee_id"):
            stmt = stmt.where(getattr(Interview, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Interview, "code"):
                search_conds.append(getattr(Interview, "code").ilike(f"%{search}%"))
            if hasattr(Interview, "title"):
                search_conds.append(getattr(Interview, "title").ilike(f"%{search}%"))
            if hasattr(Interview, "name"):
                search_conds.append(getattr(Interview, "name").ilike(f"%{search}%"))
            if hasattr(Interview, "description"):
                search_conds.append(
                    getattr(Interview, "description").ilike(f"%{search}%")
                )
            if hasattr(Interview, "feedback"):
                search_conds.append(getattr(Interview, "feedback").ilike(f"%{search}%"))
            if hasattr(Interview, "status"):
                search_conds.append(getattr(Interview, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Interview, key):
                stmt = stmt.where(getattr(Interview, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            Interview.created_at if hasattr(Interview, "created_at") else Interview.id
        )
        if sort_by == "created_date" and hasattr(Interview, "created_at"):
            order_col = getattr(Interview, "created_at")
        elif sort_by == "updated_date" and hasattr(Interview, "updated_at"):
            order_col = getattr(Interview, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Interview, "workflow_state"):
            order_col = getattr(Interview, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Interview, "effective_date"):
            order_col = getattr(Interview, "effective_date")

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
