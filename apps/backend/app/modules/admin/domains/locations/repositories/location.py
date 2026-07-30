import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.admin.domains.locations.models.location import Location


class LocationRepository(BaseRepository[Location]):
    def __init__(self, session: AsyncSession):
        super().__init__(Location, session)

    async def get_by_code(self, company_id: uuid.UUID, code: str) -> Location | None:
        if not hasattr(Location, "code"):
            return None
        stmt = select(Location).where(
            Location.company_id == company_id,
            Location.code == code,
            Location.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Location | None:
        stmt = select(Location).where(
            Location.id == entity_id,
            Location.company_id == company_id,
            Location.deleted_at.is_(None),
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
    ) -> tuple[list[Location], int]:
        stmt = select(Location).where(
            Location.company_id == company_id, Location.deleted_at.is_(None)
        )

        # Active filter
        if is_active is not None:
            stmt = stmt.where(Location.is_active == is_active)

        # Effective date filter
        if effective_date is not None:
            stmt = stmt.where(
                Location.effective_from <= effective_date,
                or_(
                    Location.effective_to.is_(None),
                    Location.effective_to >= effective_date,
                ),
            )

        # Query filters
        for key, val in filters.items():
            if val is not None and hasattr(Location, key):
                stmt = stmt.where(getattr(Location, key) == val)

        # Search (Code, Name, Description)
        if search:
            search_conds = []
            if hasattr(Location, "code"):
                search_conds.append(Location.code.ilike(f"%{search}%"))
            if hasattr(Location, "name"):
                search_conds.append(Location.name.ilike(f"%{search}%"))
            if hasattr(Location, "description"):
                search_conds.append(Location.description.ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = Location.created_at
        if sort_by == "name" and hasattr(Location, "name"):
            order_col = Location.name
        elif sort_by == "code" and hasattr(Location, "code"):
            order_col = Location.code
        elif sort_by == "effective_date" and hasattr(Location, "effective_from"):
            order_col = Location.effective_from

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
