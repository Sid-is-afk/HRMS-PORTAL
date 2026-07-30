import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.recruitment.models.offer import Offer


class OfferRepository(BaseRepository[Offer]):
    def __init__(self, session: AsyncSession):
        super().__init__(Offer, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Offer | None:
        stmt = select(Offer).where(
            Offer.id == entity_id,
            Offer.company_id == company_id,
        )
        if hasattr(Offer, "deleted_at"):
            stmt = stmt.where(getattr(Offer, "deleted_at").is_(None))
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
    ) -> tuple[list[Offer], int]:
        stmt = select(Offer).where(
            Offer.company_id == company_id,
        )
        if hasattr(Offer, "deleted_at"):
            stmt = stmt.where(getattr(Offer, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Offer, "workflow_state"):
            stmt = stmt.where(getattr(Offer, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Offer, "employee_id"):
            stmt = stmt.where(getattr(Offer, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Offer, "code"):
                search_conds.append(getattr(Offer, "code").ilike(f"%{search}%"))
            if hasattr(Offer, "title"):
                search_conds.append(getattr(Offer, "title").ilike(f"%{search}%"))
            if hasattr(Offer, "name"):
                search_conds.append(getattr(Offer, "name").ilike(f"%{search}%"))
            if hasattr(Offer, "description"):
                search_conds.append(getattr(Offer, "description").ilike(f"%{search}%"))
            if hasattr(Offer, "feedback"):
                search_conds.append(getattr(Offer, "feedback").ilike(f"%{search}%"))
            if hasattr(Offer, "status"):
                search_conds.append(getattr(Offer, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Offer, key):
                stmt = stmt.where(getattr(Offer, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = Offer.created_at if hasattr(Offer, "created_at") else Offer.id
        if sort_by == "created_date" and hasattr(Offer, "created_at"):
            order_col = getattr(Offer, "created_at")
        elif sort_by == "updated_date" and hasattr(Offer, "updated_at"):
            order_col = getattr(Offer, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Offer, "workflow_state"):
            order_col = getattr(Offer, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Offer, "effective_date"):
            order_col = getattr(Offer, "effective_date")

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
