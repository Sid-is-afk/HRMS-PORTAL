import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.offboarding.models.offboarding import Offboarding


class OffboardingRepository(BaseRepository[Offboarding]):
    def __init__(self, session: AsyncSession):
        super().__init__(Offboarding, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Offboarding | None:
        stmt = select(Offboarding).where(
            Offboarding.id == entity_id,
            Offboarding.company_id == company_id,
        )
        if hasattr(Offboarding, "deleted_at"):
            stmt = stmt.where(getattr(Offboarding, "deleted_at").is_(None))
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
    ) -> tuple[list[Offboarding], int]:
        stmt = select(Offboarding).where(
            Offboarding.company_id == company_id,
        )
        if hasattr(Offboarding, "deleted_at"):
            stmt = stmt.where(getattr(Offboarding, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Offboarding, "workflow_state"):
            stmt = stmt.where(getattr(Offboarding, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Offboarding, "employee_id"):
            stmt = stmt.where(getattr(Offboarding, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Offboarding, "code"):
                search_conds.append(getattr(Offboarding, "code").ilike(f"%{search}%"))
            if hasattr(Offboarding, "title"):
                search_conds.append(getattr(Offboarding, "title").ilike(f"%{search}%"))
            if hasattr(Offboarding, "name"):
                search_conds.append(getattr(Offboarding, "name").ilike(f"%{search}%"))
            if hasattr(Offboarding, "description"):
                search_conds.append(
                    getattr(Offboarding, "description").ilike(f"%{search}%")
                )
            if hasattr(Offboarding, "feedback"):
                search_conds.append(
                    getattr(Offboarding, "feedback").ilike(f"%{search}%")
                )
            if hasattr(Offboarding, "status"):
                search_conds.append(getattr(Offboarding, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Offboarding, key):
                stmt = stmt.where(getattr(Offboarding, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            Offboarding.created_at
            if hasattr(Offboarding, "created_at")
            else Offboarding.id
        )
        if sort_by == "created_date" and hasattr(Offboarding, "created_at"):
            order_col = getattr(Offboarding, "created_at")
        elif sort_by == "updated_date" and hasattr(Offboarding, "updated_at"):
            order_col = getattr(Offboarding, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Offboarding, "workflow_state"):
            order_col = getattr(Offboarding, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Offboarding, "effective_date"):
            order_col = getattr(Offboarding, "effective_date")

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
