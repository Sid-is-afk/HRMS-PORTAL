import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.platform.domains.tenant.models.tenant import Tenant


class TenantRepository(BaseRepository[Tenant]):
    def __init__(self, session: AsyncSession):
        super().__init__(Tenant, session)

    async def get_by_code(self, code: str) -> Tenant | None:
        stmt = select(Tenant).where(
            Tenant.tenant_code == code, Tenant.deleted_at.is_(None)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_by_name(self, name: str) -> Tenant | None:
        stmt = select(Tenant).where(
            Tenant.tenant_name == name, Tenant.deleted_at.is_(None)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_by_id_with_tenant(
        self, company_id: uuid.UUID, entity_id: uuid.UUID
    ) -> Tenant | None:
        # For tenant root table, query by id directly
        return await self.get_by_id(entity_id)

    async def get_paginated(
        self,
        page: int,
        size: int,
        search: str | None = None,
        provisioning_status: str | None = None,
        subscription_plan: str | None = None,
        license_id: uuid.UUID | None = None,
        status: str | None = None,
        created_date: Any | None = None,
        sort_by: str | None = None,
        sort_order: str = "asc",
        **filters: Any,
    ) -> tuple[list[Tenant], int]:
        stmt = select(Tenant).where(Tenant.deleted_at.is_(None))

        # Filters
        if provisioning_status:
            stmt = stmt.where(Tenant.provisioning_status == provisioning_status)
        if subscription_plan:
            stmt = stmt.where(Tenant.subscription_plan == subscription_plan)
        if license_id:
            stmt = stmt.where(Tenant.license_id == license_id)
        if status:
            stmt = stmt.where(Tenant.status == status)

        # Full-text search
        if search:
            stmt = stmt.where(
                or_(
                    Tenant.tenant_name.ilike(f"%{search}%"),
                    Tenant.tenant_code.ilike(f"%{search}%"),
                    Tenant.status.ilike(f"%{search}%"),
                    Tenant.subscription_plan.ilike(f"%{search}%"),
                    Tenant.provisioning_status.ilike(f"%{search}%"),
                )
            )

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_res = await self.session.execute(count_stmt)
        total_records = count_res.scalar() or 0

        # Sorting
        order_col: Any = Tenant.created_at
        if sort_by == "created_date":
            order_col = Tenant.created_at
        elif sort_by == "tenant_name":
            order_col = Tenant.tenant_name
        elif sort_by == "subscription":
            order_col = Tenant.subscription_plan
        elif sort_by == "provisioning_status":
            order_col = Tenant.provisioning_status

        if sort_order == "desc":
            stmt = stmt.order_by(order_col.desc())
        else:
            stmt = stmt.order_by(order_col.asc())

        # Pagination
        offset = (page - 1) * size
        stmt = stmt.offset(offset).limit(size)

        res = await self.session.execute(stmt)
        entities = list(res.scalars().all())
        return entities, total_records
