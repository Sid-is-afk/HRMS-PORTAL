import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repository import BaseRepository
from app.modules.platform.domains.provisioning.models.provisioning import (
    ProvisioningHistory,
    ProvisioningJob,
)


class ProvisioningRepository(BaseRepository[ProvisioningJob]):
    def __init__(self, session: AsyncSession):
        super().__init__(ProvisioningJob, session)

    async def get_active_job_by_tenant_id(
        self, tenant_id: uuid.UUID
    ) -> ProvisioningJob | None:
        stmt = (
            select(ProvisioningJob)
            .where(ProvisioningJob.tenant_id == tenant_id)
            .order_by(ProvisioningJob.created_at.desc())
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def create_history(self, history: ProvisioningHistory) -> ProvisioningHistory:
        self.session.add(history)
        await self.session.flush()
        await self.session.refresh(history)
        return history

    async def get_histories_by_job_id(
        self, job_id: uuid.UUID
    ) -> list[ProvisioningHistory]:
        stmt = (
            select(ProvisioningHistory)
            .where(ProvisioningHistory.job_id == job_id)
            .order_by(ProvisioningHistory.created_at.asc())
        )
        res = await self.session.execute(stmt)
        return list(res.scalars().all())
