import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.shift.models.shift_assignment import ShiftAssignment


class ShiftAssignmentRepository(BaseRepository[ShiftAssignment]):
    def __init__(self, session: AsyncSession):
        super().__init__(ShiftAssignment, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> ShiftAssignment | None:
        stmt = select(ShiftAssignment).where(
            ShiftAssignment.id == entity_id,
            ShiftAssignment.company_id == company_id,
        )
        if hasattr(ShiftAssignment, "deleted_at"):
            stmt = stmt.where(getattr(ShiftAssignment, "deleted_at").is_(None))
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
    ) -> tuple[list[ShiftAssignment], int]:
        stmt = select(ShiftAssignment).where(
            ShiftAssignment.company_id == company_id,
        )
        if hasattr(ShiftAssignment, "deleted_at"):
            stmt = stmt.where(getattr(ShiftAssignment, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(ShiftAssignment, "workflow_state"):
            stmt = stmt.where(
                getattr(ShiftAssignment, "workflow_state") == workflow_state
            )

        # Employee filter
        if employee_id is not None and hasattr(ShiftAssignment, "employee_id"):
            stmt = stmt.where(getattr(ShiftAssignment, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(ShiftAssignment, "code"):
                search_conds.append(
                    getattr(ShiftAssignment, "code").ilike(f"%{search}%")
                )
            if hasattr(ShiftAssignment, "title"):
                search_conds.append(
                    getattr(ShiftAssignment, "title").ilike(f"%{search}%")
                )
            if hasattr(ShiftAssignment, "name"):
                search_conds.append(
                    getattr(ShiftAssignment, "name").ilike(f"%{search}%")
                )
            if hasattr(ShiftAssignment, "description"):
                search_conds.append(
                    getattr(ShiftAssignment, "description").ilike(f"%{search}%")
                )
            if hasattr(ShiftAssignment, "feedback"):
                search_conds.append(
                    getattr(ShiftAssignment, "feedback").ilike(f"%{search}%")
                )
            if hasattr(ShiftAssignment, "status"):
                search_conds.append(
                    getattr(ShiftAssignment, "status").ilike(f"%{search}%")
                )
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(ShiftAssignment, key):
                stmt = stmt.where(getattr(ShiftAssignment, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            ShiftAssignment.created_at
            if hasattr(ShiftAssignment, "created_at")
            else ShiftAssignment.id
        )
        if sort_by == "created_date" and hasattr(ShiftAssignment, "created_at"):
            order_col = getattr(ShiftAssignment, "created_at")
        elif sort_by == "updated_date" and hasattr(ShiftAssignment, "updated_at"):
            order_col = getattr(ShiftAssignment, "updated_at")
        elif sort_by == "workflow_state" and hasattr(ShiftAssignment, "workflow_state"):
            order_col = getattr(ShiftAssignment, "workflow_state")
        elif sort_by == "effective_date" and hasattr(ShiftAssignment, "effective_date"):
            order_col = getattr(ShiftAssignment, "effective_date")

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
