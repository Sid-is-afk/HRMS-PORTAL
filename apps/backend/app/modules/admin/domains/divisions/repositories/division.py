import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.admin.domains.divisions.models.division import Division


class DivisionRepository(BaseRepository[Division]):
    def __init__(self, session: AsyncSession):
        super().__init__(Division, session)

    async def get_by_code(self, company_id: uuid.UUID, code: str) -> Division | None:
        if not hasattr(Division, "code"):
            return None
        stmt = select(Division).where(
            Division.company_id == company_id,
            Division.code == code,
            Division.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Division | None:
        stmt = select(Division).where(
            Division.id == entity_id,
            Division.company_id == company_id,
            Division.deleted_at.is_(None),
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
    ) -> tuple[list[Division], int]:
        stmt = select(Division).where(
            Division.company_id == company_id, Division.deleted_at.is_(None)
        )

        # Active filter
        if is_active is not None:
            stmt = stmt.where(Division.is_active == is_active)

        # Effective date filter
        if effective_date is not None:
            stmt = stmt.where(
                Division.effective_from <= effective_date,
                or_(
                    Division.effective_to.is_(None),
                    Division.effective_to >= effective_date,
                ),
            )

        # Query filters
        for key, val in filters.items():
            if val is not None and hasattr(Division, key):
                stmt = stmt.where(getattr(Division, key) == val)

        # Search (Code, Name, Description)
        if search:
            search_conds = []
            if hasattr(Division, "code"):
                search_conds.append(Division.code.ilike(f"%{search}%"))
            if hasattr(Division, "name"):
                search_conds.append(Division.name.ilike(f"%{search}%"))
            if hasattr(Division, "description"):
                search_conds.append(Division.description.ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = Division.created_at
        if sort_by == "name" and hasattr(Division, "name"):
            order_col = Division.name
        elif sort_by == "code" and hasattr(Division, "code"):
            order_col = Division.code
        elif sort_by == "effective_date" and hasattr(Division, "effective_from"):
            order_col = Division.effective_from

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
