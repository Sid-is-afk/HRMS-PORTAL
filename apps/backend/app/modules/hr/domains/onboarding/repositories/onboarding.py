import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.onboarding.models.onboarding import Onboarding


class OnboardingRepository(BaseRepository[Onboarding]):
    def __init__(self, session: AsyncSession):
        super().__init__(Onboarding, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Onboarding | None:
        stmt = select(Onboarding).where(
            Onboarding.id == entity_id,
            Onboarding.company_id == company_id,
        )
        if hasattr(Onboarding, "deleted_at"):
            stmt = stmt.where(getattr(Onboarding, "deleted_at").is_(None))
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
    ) -> tuple[list[Onboarding], int]:
        stmt = select(Onboarding).where(
            Onboarding.company_id == company_id,
        )
        if hasattr(Onboarding, "deleted_at"):
            stmt = stmt.where(getattr(Onboarding, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Onboarding, "workflow_state"):
            stmt = stmt.where(getattr(Onboarding, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Onboarding, "employee_id"):
            stmt = stmt.where(getattr(Onboarding, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Onboarding, "code"):
                search_conds.append(getattr(Onboarding, "code").ilike(f"%{search}%"))
            if hasattr(Onboarding, "title"):
                search_conds.append(getattr(Onboarding, "title").ilike(f"%{search}%"))
            if hasattr(Onboarding, "name"):
                search_conds.append(getattr(Onboarding, "name").ilike(f"%{search}%"))
            if hasattr(Onboarding, "description"):
                search_conds.append(
                    getattr(Onboarding, "description").ilike(f"%{search}%")
                )
            if hasattr(Onboarding, "feedback"):
                search_conds.append(
                    getattr(Onboarding, "feedback").ilike(f"%{search}%")
                )
            if hasattr(Onboarding, "status"):
                search_conds.append(getattr(Onboarding, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Onboarding, key):
                stmt = stmt.where(getattr(Onboarding, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            Onboarding.created_at
            if hasattr(Onboarding, "created_at")
            else Onboarding.id
        )
        if sort_by == "created_date" and hasattr(Onboarding, "created_at"):
            order_col = getattr(Onboarding, "created_at")
        elif sort_by == "updated_date" and hasattr(Onboarding, "updated_at"):
            order_col = getattr(Onboarding, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Onboarding, "workflow_state"):
            order_col = getattr(Onboarding, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Onboarding, "effective_date"):
            order_col = getattr(Onboarding, "effective_date")

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
