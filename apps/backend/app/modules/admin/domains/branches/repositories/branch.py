import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.admin.domains.branches.models.branch import Branch


class BranchRepository(BaseRepository[Branch]):
    def __init__(self, session: AsyncSession):
        super().__init__(Branch, session)

    async def get_by_code(self, company_id: uuid.UUID, code: str) -> Branch | None:
        if not hasattr(Branch, "code"):
            return None
        stmt = select(Branch).where(
            Branch.company_id == company_id,
            Branch.code == code,
            Branch.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Branch | None:
        stmt = select(Branch).where(
            Branch.id == entity_id,
            Branch.company_id == company_id,
            Branch.deleted_at.is_(None),
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
    ) -> tuple[list[Branch], int]:
        stmt = select(Branch).where(
            Branch.company_id == company_id, Branch.deleted_at.is_(None)
        )

        # Active filter
        if is_active is not None:
            stmt = stmt.where(Branch.is_active == is_active)

        # Effective date filter
        if effective_date is not None:
            stmt = stmt.where(
                Branch.effective_from <= effective_date,
                or_(
                    Branch.effective_to.is_(None),
                    Branch.effective_to >= effective_date,
                ),
            )

        # Query filters
        for key, val in filters.items():
            if val is not None and hasattr(Branch, key):
                stmt = stmt.where(getattr(Branch, key) == val)

        # Search (Code, Name, Description)
        if search:
            search_conds = []
            if hasattr(Branch, "code"):
                search_conds.append(Branch.code.ilike(f"%{search}%"))
            if hasattr(Branch, "name"):
                search_conds.append(Branch.name.ilike(f"%{search}%"))
            if hasattr(Branch, "description"):
                search_conds.append(Branch.description.ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = Branch.created_at
        if sort_by == "name" and hasattr(Branch, "name"):
            order_col = Branch.name
        elif sort_by == "code" and hasattr(Branch, "code"):
            order_col = Branch.code
        elif sort_by == "effective_date" and hasattr(Branch, "effective_from"):
            order_col = Branch.effective_from

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
