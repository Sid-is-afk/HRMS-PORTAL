import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.promotion.models.promotion import Promotion


class PromotionRepository(BaseRepository[Promotion]):
    def __init__(self, session: AsyncSession):
        super().__init__(Promotion, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Promotion | None:
        stmt = select(Promotion).where(
            Promotion.id == entity_id,
            Promotion.company_id == company_id,
        )
        if hasattr(Promotion, "deleted_at"):
            stmt = stmt.where(getattr(Promotion, "deleted_at").is_(None))
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
    ) -> tuple[list[Promotion], int]:
        stmt = select(Promotion).where(
            Promotion.company_id == company_id,
        )
        if hasattr(Promotion, "deleted_at"):
            stmt = stmt.where(getattr(Promotion, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Promotion, "workflow_state"):
            stmt = stmt.where(getattr(Promotion, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Promotion, "employee_id"):
            stmt = stmt.where(getattr(Promotion, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Promotion, "code"):
                search_conds.append(getattr(Promotion, "code").ilike(f"%{search}%"))
            if hasattr(Promotion, "title"):
                search_conds.append(getattr(Promotion, "title").ilike(f"%{search}%"))
            if hasattr(Promotion, "name"):
                search_conds.append(getattr(Promotion, "name").ilike(f"%{search}%"))
            if hasattr(Promotion, "description"):
                search_conds.append(
                    getattr(Promotion, "description").ilike(f"%{search}%")
                )
            if hasattr(Promotion, "feedback"):
                search_conds.append(getattr(Promotion, "feedback").ilike(f"%{search}%"))
            if hasattr(Promotion, "status"):
                search_conds.append(getattr(Promotion, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Promotion, key):
                stmt = stmt.where(getattr(Promotion, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            Promotion.created_at if hasattr(Promotion, "created_at") else Promotion.id
        )
        if sort_by == "created_date" and hasattr(Promotion, "created_at"):
            order_col = getattr(Promotion, "created_at")
        elif sort_by == "updated_date" and hasattr(Promotion, "updated_at"):
            order_col = getattr(Promotion, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Promotion, "workflow_state"):
            order_col = getattr(Promotion, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Promotion, "effective_date"):
            order_col = getattr(Promotion, "effective_date")

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
