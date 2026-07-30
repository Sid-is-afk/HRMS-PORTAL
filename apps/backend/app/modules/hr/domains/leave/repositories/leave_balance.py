import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.leave.models.leave_balance import LeaveBalance


class LeaveBalanceRepository(BaseRepository[LeaveBalance]):
    def __init__(self, session: AsyncSession):
        super().__init__(LeaveBalance, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> LeaveBalance | None:
        stmt = select(LeaveBalance).where(
            LeaveBalance.id == entity_id,
            LeaveBalance.company_id == company_id,
        )
        if hasattr(LeaveBalance, "deleted_at"):
            stmt = stmt.where(getattr(LeaveBalance, "deleted_at").is_(None))
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
    ) -> tuple[list[LeaveBalance], int]:
        stmt = select(LeaveBalance).where(
            LeaveBalance.company_id == company_id,
        )
        if hasattr(LeaveBalance, "deleted_at"):
            stmt = stmt.where(getattr(LeaveBalance, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(LeaveBalance, "workflow_state"):
            stmt = stmt.where(getattr(LeaveBalance, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(LeaveBalance, "employee_id"):
            stmt = stmt.where(getattr(LeaveBalance, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(LeaveBalance, "code"):
                search_conds.append(getattr(LeaveBalance, "code").ilike(f"%{search}%"))
            if hasattr(LeaveBalance, "title"):
                search_conds.append(getattr(LeaveBalance, "title").ilike(f"%{search}%"))
            if hasattr(LeaveBalance, "name"):
                search_conds.append(getattr(LeaveBalance, "name").ilike(f"%{search}%"))
            if hasattr(LeaveBalance, "description"):
                search_conds.append(
                    getattr(LeaveBalance, "description").ilike(f"%{search}%")
                )
            if hasattr(LeaveBalance, "feedback"):
                search_conds.append(
                    getattr(LeaveBalance, "feedback").ilike(f"%{search}%")
                )
            if hasattr(LeaveBalance, "status"):
                search_conds.append(
                    getattr(LeaveBalance, "status").ilike(f"%{search}%")
                )
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(LeaveBalance, key):
                stmt = stmt.where(getattr(LeaveBalance, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            LeaveBalance.created_at
            if hasattr(LeaveBalance, "created_at")
            else LeaveBalance.id
        )
        if sort_by == "created_date" and hasattr(LeaveBalance, "created_at"):
            order_col = getattr(LeaveBalance, "created_at")
        elif sort_by == "updated_date" and hasattr(LeaveBalance, "updated_at"):
            order_col = getattr(LeaveBalance, "updated_at")
        elif sort_by == "workflow_state" and hasattr(LeaveBalance, "workflow_state"):
            order_col = getattr(LeaveBalance, "workflow_state")
        elif sort_by == "effective_date" and hasattr(LeaveBalance, "effective_date"):
            order_col = getattr(LeaveBalance, "effective_date")

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
