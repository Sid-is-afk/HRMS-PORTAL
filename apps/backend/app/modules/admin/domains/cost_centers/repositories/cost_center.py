import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.admin.domains.cost_centers.models.cost_center import CostCenter


class CostCenterRepository(BaseRepository[CostCenter]):
    def __init__(self, session: AsyncSession):
        super().__init__(CostCenter, session)

    async def get_by_code(self, company_id: uuid.UUID, code: str) -> CostCenter | None:
        if not hasattr(CostCenter, "code"):
            return None
        stmt = select(CostCenter).where(
            CostCenter.company_id == company_id,
            CostCenter.code == code,
            CostCenter.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> CostCenter | None:
        stmt = select(CostCenter).where(
            CostCenter.id == entity_id,
            CostCenter.company_id == company_id,
            CostCenter.deleted_at.is_(None),
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
    ) -> tuple[list[CostCenter], int]:
        stmt = select(CostCenter).where(
            CostCenter.company_id == company_id, CostCenter.deleted_at.is_(None)
        )

        # Active filter
        if is_active is not None:
            stmt = stmt.where(CostCenter.is_active == is_active)

        # Effective date filter
        if effective_date is not None:
            stmt = stmt.where(
                CostCenter.effective_from <= effective_date,
                or_(
                    CostCenter.effective_to.is_(None),
                    CostCenter.effective_to >= effective_date,
                ),
            )

        # Query filters
        for key, val in filters.items():
            if val is not None and hasattr(CostCenter, key):
                stmt = stmt.where(getattr(CostCenter, key) == val)

        # Search (Code, Name, Description)
        if search:
            search_conds = []
            if hasattr(CostCenter, "code"):
                search_conds.append(CostCenter.code.ilike(f"%{search}%"))
            if hasattr(CostCenter, "name"):
                search_conds.append(CostCenter.name.ilike(f"%{search}%"))
            if hasattr(CostCenter, "description"):
                search_conds.append(CostCenter.description.ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = CostCenter.created_at
        if sort_by == "name" and hasattr(CostCenter, "name"):
            order_col = CostCenter.name
        elif sort_by == "code" and hasattr(CostCenter, "code"):
            order_col = CostCenter.code
        elif sort_by == "effective_date" and hasattr(CostCenter, "effective_from"):
            order_col = CostCenter.effective_from

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
