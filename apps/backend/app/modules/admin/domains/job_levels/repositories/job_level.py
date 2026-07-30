import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.admin.domains.job_levels.models.job_level import JobLevel


class JobLevelRepository(BaseRepository[JobLevel]):
    def __init__(self, session: AsyncSession):
        super().__init__(JobLevel, session)

    async def get_by_code(self, company_id: uuid.UUID, code: str) -> JobLevel | None:
        if not hasattr(JobLevel, "code"):
            return None
        stmt = select(JobLevel).where(
            JobLevel.company_id == company_id,
            JobLevel.code == code,
            JobLevel.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> JobLevel | None:
        stmt = select(JobLevel).where(
            JobLevel.id == entity_id,
            JobLevel.company_id == company_id,
            JobLevel.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_paginated(
        self,
        company_id: uuid.UUID,
        page: int,
        size: int,
        search: str | None = None,
        is_active: bool | None = None,
        effective_date: date | None = None,
        sort_by: str | None = None,
        sort_order: str = "asc",
        **filters: Any,
    ) -> tuple[list[JobLevel], int]:
        stmt = select(JobLevel).where(
            JobLevel.company_id == company_id, JobLevel.deleted_at.is_(None)
        )

        # Active filter
        if is_active is not None:
            stmt = stmt.where(JobLevel.is_active == is_active)

        # Effective date filter
        if effective_date is not None:
            stmt = stmt.where(
                JobLevel.effective_from <= effective_date,
                or_(
                    JobLevel.effective_to.is_(None),
                    JobLevel.effective_to >= effective_date,
                ),
            )

        # Query filters
        for key, val in filters.items():
            if val is not None and hasattr(JobLevel, key):
                stmt = stmt.where(getattr(JobLevel, key) == val)

        # Search (Code, Name, Description)
        if search:
            search_conds = []
            if hasattr(JobLevel, "code"):
                search_conds.append(JobLevel.code.ilike(f"%{search}%"))
            if hasattr(JobLevel, "name"):
                search_conds.append(JobLevel.name.ilike(f"%{search}%"))
            if hasattr(JobLevel, "description"):
                search_conds.append(JobLevel.description.ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = JobLevel.created_at
        if sort_by == "name" and hasattr(JobLevel, "name"):
            order_col = JobLevel.name
        elif sort_by == "code" and hasattr(JobLevel, "code"):
            order_col = JobLevel.code
        elif sort_by == "effective_date" and hasattr(JobLevel, "effective_from"):
            order_col = JobLevel.effective_from

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
