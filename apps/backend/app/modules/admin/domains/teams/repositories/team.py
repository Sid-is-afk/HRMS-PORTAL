import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.admin.domains.teams.models.team import Team


class TeamRepository(BaseRepository[Team]):
    def __init__(self, session: AsyncSession):
        super().__init__(Team, session)

    async def get_by_code(self, company_id: uuid.UUID, code: str) -> Team | None:
        if not hasattr(Team, "code"):
            return None
        stmt = select(Team).where(
            Team.company_id == company_id,
            Team.code == code,
            Team.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Team | None:
        stmt = select(Team).where(
            Team.id == entity_id,
            Team.company_id == company_id,
            Team.deleted_at.is_(None),
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
    ) -> tuple[list[Team], int]:
        stmt = select(Team).where(
            Team.company_id == company_id, Team.deleted_at.is_(None)
        )

        # Active filter
        if is_active is not None:
            stmt = stmt.where(Team.is_active == is_active)

        # Effective date filter
        if effective_date is not None:
            stmt = stmt.where(
                Team.effective_from <= effective_date,
                or_(
                    Team.effective_to.is_(None),
                    Team.effective_to >= effective_date,
                ),
            )

        # Query filters
        for key, val in filters.items():
            if val is not None and hasattr(Team, key):
                stmt = stmt.where(getattr(Team, key) == val)

        # Search (Code, Name, Description)
        if search:
            search_conds = []
            if hasattr(Team, "code"):
                search_conds.append(Team.code.ilike(f"%{search}%"))
            if hasattr(Team, "name"):
                search_conds.append(Team.name.ilike(f"%{search}%"))
            if hasattr(Team, "description"):
                search_conds.append(Team.description.ilike(f"%{search}%"))
            if search_conds:
                stmt = stmt.where(or_(*search_conds))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any = Team.created_at
        if sort_by == "name" and hasattr(Team, "name"):
            order_col = Team.name
        elif sort_by == "code" and hasattr(Team, "code"):
            order_col = Team.code
        elif sort_by == "effective_date" and hasattr(Team, "effective_from"):
            order_col = Team.effective_from

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
