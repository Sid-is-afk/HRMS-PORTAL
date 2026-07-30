import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.admin.domains.designations.models.designation import Designation


class DesignationRepository(BaseRepository[Designation]):
    def __init__(self, session: AsyncSession):
        super().__init__(Designation, session)

    async def get_by_code(self, company_id: uuid.UUID, code: str) -> Designation | None:
        if not hasattr(Designation, "code"):
            return None
        stmt = select(Designation).where(
            Designation.company_id == company_id,
            Designation.code == code,
            Designation.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Designation | None:
        stmt = select(Designation).where(
            Designation.id == entity_id,
            Designation.company_id == company_id,
            Designation.deleted_at.is_(None),
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
    ) -> tuple[list[Designation], int]:
        stmt = select(Designation).where(
            Designation.company_id == company_id, Designation.deleted_at.is_(None)
        )

        # Active filter
        if is_active is not None:
            stmt = stmt.where(Designation.is_active == is_active)

        # Effective date filter
        if effective_date is not None:
            stmt = stmt.where(
                Designation.effective_from <= effective_date,
                or_(
                    Designation.effective_to.is_(None),
                    Designation.effective_to >= effective_date,
                ),
            )

        # Query filters
        for key, val in filters.items():
            if val is not None and hasattr(Designation, key):
                stmt = stmt.where(getattr(Designation, key) == val)

        # Search (Code, Name, Description)
        if search:
            search_conds = []
            if hasattr(Designation, "code"):
                search_conds.append(Designation.code.ilike(f"%{search}%"))
            if hasattr(Designation, "name"):
                search_conds.append(Designation.name.ilike(f"%{search}%"))
            if hasattr(Designation, "description"):
                search_conds.append(Designation.description.ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = Designation.created_at
        if sort_by == "name" and hasattr(Designation, "name"):
            order_col = Designation.name
        elif sort_by == "code" and hasattr(Designation, "code"):
            order_col = Designation.code
        elif sort_by == "effective_date" and hasattr(Designation, "effective_from"):
            order_col = Designation.effective_from

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
