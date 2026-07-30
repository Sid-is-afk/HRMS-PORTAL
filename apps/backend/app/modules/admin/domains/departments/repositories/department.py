import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.admin.domains.departments.models.department import Department


class DepartmentRepository(BaseRepository[Department]):
    def __init__(self, session: AsyncSession):
        super().__init__(Department, session)

    async def get_by_code(self, company_id: uuid.UUID, code: str) -> Department | None:
        if not hasattr(Department, "code"):
            return None
        stmt = select(Department).where(
            Department.company_id == company_id,
            Department.code == code,
            Department.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Department | None:
        stmt = select(Department).where(
            Department.id == entity_id,
            Department.company_id == company_id,
            Department.deleted_at.is_(None),
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
    ) -> tuple[list[Department], int]:
        stmt = select(Department).where(
            Department.company_id == company_id, Department.deleted_at.is_(None)
        )

        # Active filter
        if is_active is not None:
            stmt = stmt.where(Department.is_active == is_active)

        # Effective date filter
        if effective_date is not None:
            stmt = stmt.where(
                Department.effective_from <= effective_date,
                or_(
                    Department.effective_to.is_(None),
                    Department.effective_to >= effective_date,
                ),
            )

        # Query filters
        for key, val in filters.items():
            if val is not None and hasattr(Department, key):
                stmt = stmt.where(getattr(Department, key) == val)

        # Search (Code, Name, Description)
        if search:
            search_conds = []
            if hasattr(Department, "code"):
                search_conds.append(Department.code.ilike(f"%{search}%"))
            if hasattr(Department, "name"):
                search_conds.append(Department.name.ilike(f"%{search}%"))
            if hasattr(Department, "description"):
                search_conds.append(Department.description.ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = Department.created_at
        if sort_by == "name" and hasattr(Department, "name"):
            order_col = Department.name
        elif sort_by == "code" and hasattr(Department, "code"):
            order_col = Department.code
        elif sort_by == "effective_date" and hasattr(Department, "effective_from"):
            order_col = Department.effective_from

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
