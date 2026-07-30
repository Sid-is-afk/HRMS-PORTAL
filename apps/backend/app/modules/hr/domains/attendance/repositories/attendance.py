import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.attendance.models.attendance import Attendance


class AttendanceRepository(BaseRepository[Attendance]):
    def __init__(self, session: AsyncSession):
        super().__init__(Attendance, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Attendance | None:
        stmt = select(Attendance).where(
            Attendance.id == entity_id,
            Attendance.company_id == company_id,
        )
        if hasattr(Attendance, "deleted_at"):
            stmt = stmt.where(getattr(Attendance, "deleted_at").is_(None))
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
    ) -> tuple[list[Attendance], int]:
        stmt = select(Attendance).where(
            Attendance.company_id == company_id,
        )
        if hasattr(Attendance, "deleted_at"):
            stmt = stmt.where(getattr(Attendance, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Attendance, "workflow_state"):
            stmt = stmt.where(getattr(Attendance, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Attendance, "employee_id"):
            stmt = stmt.where(getattr(Attendance, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Attendance, "code"):
                search_conds.append(getattr(Attendance, "code").ilike(f"%{search}%"))
            if hasattr(Attendance, "title"):
                search_conds.append(getattr(Attendance, "title").ilike(f"%{search}%"))
            if hasattr(Attendance, "name"):
                search_conds.append(getattr(Attendance, "name").ilike(f"%{search}%"))
            if hasattr(Attendance, "description"):
                search_conds.append(
                    getattr(Attendance, "description").ilike(f"%{search}%")
                )
            if hasattr(Attendance, "feedback"):
                search_conds.append(
                    getattr(Attendance, "feedback").ilike(f"%{search}%")
                )
            if hasattr(Attendance, "status"):
                search_conds.append(getattr(Attendance, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Attendance, key):
                stmt = stmt.where(getattr(Attendance, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            Attendance.created_at
            if hasattr(Attendance, "created_at")
            else Attendance.id
        )
        if sort_by == "created_date" and hasattr(Attendance, "created_at"):
            order_col = getattr(Attendance, "created_at")
        elif sort_by == "updated_date" and hasattr(Attendance, "updated_at"):
            order_col = getattr(Attendance, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Attendance, "workflow_state"):
            order_col = getattr(Attendance, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Attendance, "effective_date"):
            order_col = getattr(Attendance, "effective_date")

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
