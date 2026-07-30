import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.performance.models.performance import PerformanceReview


class PerformanceReviewRepository(BaseRepository[PerformanceReview]):
    def __init__(self, session: AsyncSession):
        super().__init__(PerformanceReview, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> PerformanceReview | None:
        stmt = select(PerformanceReview).where(
            PerformanceReview.id == entity_id,
            PerformanceReview.company_id == company_id,
        )
        if hasattr(PerformanceReview, "deleted_at"):
            stmt = stmt.where(getattr(PerformanceReview, "deleted_at").is_(None))
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
    ) -> tuple[list[PerformanceReview], int]:
        stmt = select(PerformanceReview).where(
            PerformanceReview.company_id == company_id,
        )
        if hasattr(PerformanceReview, "deleted_at"):
            stmt = stmt.where(getattr(PerformanceReview, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(PerformanceReview, "workflow_state"):
            stmt = stmt.where(
                getattr(PerformanceReview, "workflow_state") == workflow_state
            )

        # Employee filter
        if employee_id is not None and hasattr(PerformanceReview, "employee_id"):
            stmt = stmt.where(getattr(PerformanceReview, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(PerformanceReview, "code"):
                search_conds.append(
                    getattr(PerformanceReview, "code").ilike(f"%{search}%")
                )
            if hasattr(PerformanceReview, "title"):
                search_conds.append(
                    getattr(PerformanceReview, "title").ilike(f"%{search}%")
                )
            if hasattr(PerformanceReview, "name"):
                search_conds.append(
                    getattr(PerformanceReview, "name").ilike(f"%{search}%")
                )
            if hasattr(PerformanceReview, "description"):
                search_conds.append(
                    getattr(PerformanceReview, "description").ilike(f"%{search}%")
                )
            if hasattr(PerformanceReview, "feedback"):
                search_conds.append(
                    getattr(PerformanceReview, "feedback").ilike(f"%{search}%")
                )
            if hasattr(PerformanceReview, "status"):
                search_conds.append(
                    getattr(PerformanceReview, "status").ilike(f"%{search}%")
                )
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(PerformanceReview, key):
                stmt = stmt.where(getattr(PerformanceReview, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            PerformanceReview.created_at
            if hasattr(PerformanceReview, "created_at")
            else PerformanceReview.id
        )
        if sort_by == "created_date" and hasattr(PerformanceReview, "created_at"):
            order_col = getattr(PerformanceReview, "created_at")
        elif sort_by == "updated_date" and hasattr(PerformanceReview, "updated_at"):
            order_col = getattr(PerformanceReview, "updated_at")
        elif sort_by == "workflow_state" and hasattr(
            PerformanceReview, "workflow_state"
        ):
            order_col = getattr(PerformanceReview, "workflow_state")
        elif sort_by == "effective_date" and hasattr(
            PerformanceReview, "effective_date"
        ):
            order_col = getattr(PerformanceReview, "effective_date")

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
