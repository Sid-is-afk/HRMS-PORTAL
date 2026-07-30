import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.transfer.models.transfer import Transfer


class TransferRepository(BaseRepository[Transfer]):
    def __init__(self, session: AsyncSession):
        super().__init__(Transfer, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Transfer | None:
        stmt = select(Transfer).where(
            Transfer.id == entity_id,
            Transfer.company_id == company_id,
        )
        if hasattr(Transfer, "deleted_at"):
            stmt = stmt.where(getattr(Transfer, "deleted_at").is_(None))
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
    ) -> tuple[list[Transfer], int]:
        stmt = select(Transfer).where(
            Transfer.company_id == company_id,
        )
        if hasattr(Transfer, "deleted_at"):
            stmt = stmt.where(getattr(Transfer, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Transfer, "workflow_state"):
            stmt = stmt.where(getattr(Transfer, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Transfer, "employee_id"):
            stmt = stmt.where(getattr(Transfer, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Transfer, "code"):
                search_conds.append(getattr(Transfer, "code").ilike(f"%{search}%"))
            if hasattr(Transfer, "title"):
                search_conds.append(getattr(Transfer, "title").ilike(f"%{search}%"))
            if hasattr(Transfer, "name"):
                search_conds.append(getattr(Transfer, "name").ilike(f"%{search}%"))
            if hasattr(Transfer, "description"):
                search_conds.append(
                    getattr(Transfer, "description").ilike(f"%{search}%")
                )
            if hasattr(Transfer, "feedback"):
                search_conds.append(getattr(Transfer, "feedback").ilike(f"%{search}%"))
            if hasattr(Transfer, "status"):
                search_conds.append(getattr(Transfer, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Transfer, key):
                stmt = stmt.where(getattr(Transfer, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            Transfer.created_at if hasattr(Transfer, "created_at") else Transfer.id
        )
        if sort_by == "created_date" and hasattr(Transfer, "created_at"):
            order_col = getattr(Transfer, "created_at")
        elif sort_by == "updated_date" and hasattr(Transfer, "updated_at"):
            order_col = getattr(Transfer, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Transfer, "workflow_state"):
            order_col = getattr(Transfer, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Transfer, "effective_date"):
            order_col = getattr(Transfer, "effective_date")

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
