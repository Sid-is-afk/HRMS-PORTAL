import uuid

from app.events.publishers.platform import publish_platform_event
from app.modules.platform.domains.events import FeatureEnabled
from app.modules.platform.domains.feature_flags.models.feature_flag import FeatureFlag
from app.modules.platform.domains.feature_flags.repositories.feature_flag import (
    FeatureRepository,
)
from app.modules.platform.domains.feature_flags.schemas.feature_flag import (
    FeatureFlagUpdateRequest,
)


class FeatureFlagService:
    def __init__(self, repo: FeatureRepository):
        self.repo = repo

    async def is_enabled(self, tenant_id: uuid.UUID | None, key: str) -> bool:
        flag = await self.repo.get_by_key(key, tenant_id)
        if not flag:
            return False
        return flag.is_enabled

    async def update_flag(
        self, company_id: uuid.UUID, payload: FeatureFlagUpdateRequest
    ) -> FeatureFlag:
        flag = await self.repo.get_by_key(payload.key, payload.tenant_id)
        if flag:
            flag.is_enabled = payload.is_enabled
            flag.rollout_percentage = payload.rollout_percentage
        else:
            flag = FeatureFlag(
                tenant_id=payload.tenant_id,
                key=payload.key,
                is_enabled=payload.is_enabled,
                rollout_percentage=payload.rollout_percentage,
                is_global=payload.is_global,
            )
        saved = await self.repo.create(flag)

        # Publish event
        if saved.is_enabled:
            await publish_platform_event(
                FeatureEnabled(
                    tenant_id=payload.tenant_id,
                    payload={"key": saved.key},
                )
            )
        return saved
