import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.admin.domains.business_units.models.business_unit import BusinessUnit


class BusinessUnitRepository(BaseRepository[BusinessUnit]):
    def __init__(self, session: AsyncSession):
        super().__init__(BusinessUnit, session)

    async def get_by_code(
        self, company_id: uuid.UUID, code: str
    ) -> BusinessUnit | None:
        if not hasattr(BusinessUnit, "code"):
            return None
        stmt = select(BusinessUnit).where(
            BusinessUnit.company_id == company_id,
            BusinessUnit.code == code,
            BusinessUnit.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> BusinessUnit | None:
        stmt = select(BusinessUnit).where(
            BusinessUnit.id == entity_id,
            BusinessUnit.company_id == company_id,
            BusinessUnit.deleted_at.is_(None),
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
    ) -> tuple[list[BusinessUnit], int]:
        stmt = select(BusinessUnit).where(
            BusinessUnit.company_id == company_id, BusinessUnit.deleted_at.is_(None)
        )

        # Active filter
        if is_active is not None:
            stmt = stmt.where(BusinessUnit.is_active == is_active)

        # Effective date filter
        if effective_date is not None:
            stmt = stmt.where(
                BusinessUnit.effective_from <= effective_date,
                or_(
                    BusinessUnit.effective_to.is_(None),
                    BusinessUnit.effective_to >= effective_date,
                ),
            )

        # Query filters
        for key, val in filters.items():
            if val is not None and hasattr(BusinessUnit, key):
                stmt = stmt.where(getattr(BusinessUnit, key) == val)

        # Search (Code, Name, Description)
        if search:
            search_conds = []
            if hasattr(BusinessUnit, "code"):
                search_conds.append(BusinessUnit.code.ilike(f"%{search}%"))
            if hasattr(BusinessUnit, "name"):
                search_conds.append(BusinessUnit.name.ilike(f"%{search}%"))
            if hasattr(BusinessUnit, "description"):
                search_conds.append(BusinessUnit.description.ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = BusinessUnit.created_at
        if sort_by == "name" and hasattr(BusinessUnit, "name"):
            order_col = BusinessUnit.name
        elif sort_by == "code" and hasattr(BusinessUnit, "code"):
            order_col = BusinessUnit.code
        elif sort_by == "effective_date" and hasattr(BusinessUnit, "effective_from"):
            order_col = BusinessUnit.effective_from

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
