import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.training.models.training import Training


class TrainingRepository(BaseRepository[Training]):
    def __init__(self, session: AsyncSession):
        super().__init__(Training, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Training | None:
        stmt = select(Training).where(
            Training.id == entity_id,
            Training.company_id == company_id,
        )
        if hasattr(Training, "deleted_at"):
            stmt = stmt.where(getattr(Training, "deleted_at").is_(None))
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
    ) -> tuple[list[Training], int]:
        stmt = select(Training).where(
            Training.company_id == company_id,
        )
        if hasattr(Training, "deleted_at"):
            stmt = stmt.where(getattr(Training, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Training, "workflow_state"):
            stmt = stmt.where(getattr(Training, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Training, "employee_id"):
            stmt = stmt.where(getattr(Training, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Training, "code"):
                search_conds.append(getattr(Training, "code").ilike(f"%{search}%"))
            if hasattr(Training, "title"):
                search_conds.append(getattr(Training, "title").ilike(f"%{search}%"))
            if hasattr(Training, "name"):
                search_conds.append(getattr(Training, "name").ilike(f"%{search}%"))
            if hasattr(Training, "description"):
                search_conds.append(
                    getattr(Training, "description").ilike(f"%{search}%")
                )
            if hasattr(Training, "feedback"):
                search_conds.append(getattr(Training, "feedback").ilike(f"%{search}%"))
            if hasattr(Training, "status"):
                search_conds.append(getattr(Training, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Training, key):
                stmt = stmt.where(getattr(Training, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            Training.created_at if hasattr(Training, "created_at") else Training.id
        )
        if sort_by == "created_date" and hasattr(Training, "created_at"):
            order_col = getattr(Training, "created_at")
        elif sort_by == "updated_date" and hasattr(Training, "updated_at"):
            order_col = getattr(Training, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Training, "workflow_state"):
            order_col = getattr(Training, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Training, "effective_date"):
            order_col = getattr(Training, "effective_date")

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
