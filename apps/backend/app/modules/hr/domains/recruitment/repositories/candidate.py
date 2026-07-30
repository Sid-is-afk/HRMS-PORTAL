import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.hr.domains.recruitment.models.candidate import Candidate


class CandidateRepository(BaseRepository[Candidate]):
    def __init__(self, session: AsyncSession):
        super().__init__(Candidate, session)

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Candidate | None:
        stmt = select(Candidate).where(
            Candidate.id == entity_id,
            Candidate.company_id == company_id,
        )
        if hasattr(Candidate, "deleted_at"):
            stmt = stmt.where(getattr(Candidate, "deleted_at").is_(None))
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
    ) -> tuple[list[Candidate], int]:
        stmt = select(Candidate).where(
            Candidate.company_id == company_id,
        )
        if hasattr(Candidate, "deleted_at"):
            stmt = stmt.where(getattr(Candidate, "deleted_at").is_(None))

        # Workflow state filter
        if workflow_state is not None and hasattr(Candidate, "workflow_state"):
            stmt = stmt.where(getattr(Candidate, "workflow_state") == workflow_state)

        # Employee filter
        if employee_id is not None and hasattr(Candidate, "employee_id"):
            stmt = stmt.where(getattr(Candidate, "employee_id") == employee_id)

        # Search (Code, Title, Name, Description, Feedback, Status)
        if search:
            search_conds = []
            if hasattr(Candidate, "code"):
                search_conds.append(getattr(Candidate, "code").ilike(f"%{search}%"))
            if hasattr(Candidate, "title"):
                search_conds.append(getattr(Candidate, "title").ilike(f"%{search}%"))
            if hasattr(Candidate, "name"):
                search_conds.append(getattr(Candidate, "name").ilike(f"%{search}%"))
            if hasattr(Candidate, "description"):
                search_conds.append(
                    getattr(Candidate, "description").ilike(f"%{search}%")
                )
            if hasattr(Candidate, "feedback"):
                search_conds.append(getattr(Candidate, "feedback").ilike(f"%{search}%"))
            if hasattr(Candidate, "status"):
                search_conds.append(getattr(Candidate, "status").ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Additional query filters
        for key, val in filters.items():
            if val is not None and hasattr(Candidate, key):
                stmt = stmt.where(getattr(Candidate, key) == val)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = (
            Candidate.created_at if hasattr(Candidate, "created_at") else Candidate.id
        )
        if sort_by == "created_date" and hasattr(Candidate, "created_at"):
            order_col = getattr(Candidate, "created_at")
        elif sort_by == "updated_date" and hasattr(Candidate, "updated_at"):
            order_col = getattr(Candidate, "updated_at")
        elif sort_by == "workflow_state" and hasattr(Candidate, "workflow_state"):
            order_col = getattr(Candidate, "workflow_state")
        elif sort_by == "effective_date" and hasattr(Candidate, "effective_date"):
            order_col = getattr(Candidate, "effective_date")

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
