import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.platform.domains.licensing.models.license import License


class LicenseRepository(BaseRepository[License]):
    def __init__(self, session: AsyncSession):
        super().__init__(License, session)

    async def get_by_tenant_id(self, tenant_id: uuid.UUID) -> list[License]:
        stmt = select(License).where(
            License.tenant_id == tenant_id, License.deleted_at.is_(None)
        )
        res = await self.session.execute(stmt)
        return list(res.scalars().all())

    async def get_active_by_tenant_id(self, tenant_id: uuid.UUID) -> License | None:
        stmt = select(License).where(
            License.tenant_id == tenant_id,
            License.is_active.is_(True),
            License.deleted_at.is_(None),
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()
