import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.platform.domains.feature_flags.models.feature_flag import FeatureFlag


class FeatureRepository(BaseRepository[FeatureFlag]):
    def __init__(self, session: AsyncSession):
        super().__init__(FeatureFlag, session)

    async def get_by_key(
        self, key: str, tenant_id: uuid.UUID | None = None
    ) -> FeatureFlag | None:
        if tenant_id:
            stmt = select(FeatureFlag).where(
                FeatureFlag.key == key,
                FeatureFlag.tenant_id == tenant_id,
                FeatureFlag.deleted_at.is_(None),
            )
            res = await self.session.execute(stmt)
            flag = res.scalars().first()
            if flag:
                return flag

        stmt = select(FeatureFlag).where(
            FeatureFlag.key == key,
            FeatureFlag.is_global.is_(True),
            FeatureFlag.deleted_at.is_(None),
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_tenant_flags(self, tenant_id: uuid.UUID) -> list[FeatureFlag]:
        stmt = select(FeatureFlag).where(
            FeatureFlag.tenant_id == tenant_id, FeatureFlag.deleted_at.is_(None)
        )
        res = await self.session.execute(stmt)
        return list(res.scalars().all())

    async def get_global_flags(self) -> list[FeatureFlag]:
        stmt = select(FeatureFlag).where(
            FeatureFlag.is_global.is_(True), FeatureFlag.deleted_at.is_(None)
        )
        res = await self.session.execute(stmt)
        return list(res.scalars().all())
