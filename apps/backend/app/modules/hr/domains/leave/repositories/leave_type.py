import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.leave.models.leave_type import LeaveType


class LeaveTypeRepository(BaseRepository[LeaveType]):
    def __init__(self, session: AsyncSession):
        super().__init__(LeaveType, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> LeaveType | None:
        stmt = select(LeaveType).where(
            LeaveType.id == entity_id,
            LeaveType.company_id == company_id,
        )
        if hasattr(LeaveType, "deleted_at"):
            stmt = stmt.where(getattr(LeaveType, "deleted_at").is_(None))
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
    ) -> tuple[list[LeaveType], int]:
        stmt = select(LeaveType).where(
            LeaveType.company_id == company_id,
        )
        if hasattr(LeaveType, "deleted_at"):
            stmt = stmt.where(getattr(LeaveType, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(LeaveType, "workflow_state"):
            stmt = stmt.where(getattr(LeaveType, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(LeaveType, "employee_id"):
            stmt = stmt.where(getattr(LeaveType, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(LeaveType, "code"):
                search_conds.append(getattr(LeaveType, "code").ilike(f"%{search}%"))
            if hasattr(LeaveType, "title"):
                search_conds.append(getattr(LeaveType, "title").ilike(f"%{search}%"))
            if hasattr(LeaveType, "name"):
                search_conds.append(getattr(LeaveType, "name").ilike(f"%{search}%"))
            if hasattr(LeaveType, "description"):
                search_conds.append(
                    getattr(LeaveType, "description").ilike(f"%{search}%")
                )
            if hasattr(LeaveType, "feedback"):
                search_conds.append(getattr(LeaveType, "feedback").ilike(f"%{search}%"))
            if hasattr(LeaveType, "status"):
                search_conds.append(getattr(LeaveType, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(LeaveType, key):
                stmt = stmt.where(getattr(LeaveType, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            LeaveType.created_at if hasattr(LeaveType, "created_at") else LeaveType.id
        )
        if sort_by == "created_date" and hasattr(LeaveType, "created_at"):
            order_col = getattr(LeaveType, "created_at")
        elif sort_by == "updated_date" and hasattr(LeaveType, "updated_at"):
            order_col = getattr(LeaveType, "updated_at")
        elif sort_by == "workflow_state" and hasattr(LeaveType, "workflow_state"):
            order_col = getattr(LeaveType, "workflow_state")
        elif sort_by == "effective_date" and hasattr(LeaveType, "effective_date"):
            order_col = getattr(LeaveType, "effective_date")

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
