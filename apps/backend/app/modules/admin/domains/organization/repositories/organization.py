import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.admin.domains.organization.models.organization import Organization


class OrganizationRepository(BaseRepository[Organization]):
    def __init__(self, session: AsyncSession):
        super().__init__(Organization, session)

    async def get_by_code(
        self, company_id: uuid.UUID, code: str
    ) -> Organization | None:
        if not hasattr(Organization, "code"):
            return None
        stmt = select(Organization).where(
            Organization.company_id == company_id,
            Organization.code == code,
            Organization.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Organization | None:
        stmt = select(Organization).where(
            Organization.id == entity_id,
            Organization.company_id == company_id,
            Organization.deleted_at.is_(None),
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
    ) -> tuple[list[Organization], int]:
        stmt = select(Organization).where(
            Organization.company_id == company_id, Organization.deleted_at.is_(None)
        )

        # Active filter
        if is_active is not None:
            stmt = stmt.where(Organization.is_active == is_active)

        # Effective date filter
        if effective_date is not None:
            stmt = stmt.where(
                Organization.effective_from <= effective_date,
                or_(
                    Organization.effective_to.is_(None),
                    Organization.effective_to >= effective_date,
                ),
            )

        # Query filters
        for key, val in filters.items():
            if val is not None and hasattr(Organization, key):
                stmt = stmt.where(getattr(Organization, key) == val)

        # Search (Code, Name, Description)
        if search:
            search_conds = []
            if hasattr(Organization, "code"):
                search_conds.append(Organization.code.ilike(f"%{search}%"))
            if hasattr(Organization, "name"):
                search_conds.append(Organization.name.ilike(f"%{search}%"))
            if hasattr(Organization, "description"):
                search_conds.append(Organization.description.ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = Organization.created_at
        if sort_by == "name" and hasattr(Organization, "name"):
            order_col = Organization.name
        elif sort_by == "code" and hasattr(Organization, "code"):
            order_col = Organization.code
        elif sort_by == "effective_date" and hasattr(Organization, "effective_from"):
            order_col = Organization.effective_from

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
