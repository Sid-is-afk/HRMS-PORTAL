import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.platform.domains.configuration.models.configuration import (
    PlatformConfiguration,
)


class ConfigurationRepository(BaseRepository[PlatformConfiguration]):
    def __init__(self, session: AsyncSession):
        super().__init__(PlatformConfiguration, session)

    async def get_by_key(
        self, key: str, tenant_id: uuid.UUID | None = None
    ) -> PlatformConfiguration | None:
        # Check tenant configuration first, then fallback to global
        if tenant_id:
            stmt = select(PlatformConfiguration).where(
                PlatformConfiguration.key == key,
                PlatformConfiguration.tenant_id == tenant_id,
                PlatformConfiguration.deleted_at.is_(None),
            )
            res = await self.session.execute(stmt)
            config = res.scalars().first()
            if config:
                return config

        stmt = select(PlatformConfiguration).where(
            PlatformConfiguration.key == key,
            PlatformConfiguration.is_global.is_(True),
            PlatformConfiguration.deleted_at.is_(None),
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_tenant_configurations(
        self, tenant_id: uuid.UUID
    ) -> list[PlatformConfiguration]:
        stmt = select(PlatformConfiguration).where(
            PlatformConfiguration.tenant_id == tenant_id,
            PlatformConfiguration.deleted_at.is_(None),
        )
        res = await self.session.execute(stmt)
        return list(res.scalars().all())

    async def get_global_configurations(self) -> list[PlatformConfiguration]:
        stmt = select(PlatformConfiguration).where(
            PlatformConfiguration.is_global.is_(True),
            PlatformConfiguration.deleted_at.is_(None),
        )
        res = await self.session.execute(stmt)
        return list(res.scalars().all())
