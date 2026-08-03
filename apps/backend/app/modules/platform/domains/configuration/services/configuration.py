import uuid

from app.core.exceptions.base import BusinessException
from app.events.publishers.platform import publish_platform_event
from app.modules.platform.domains.configuration.models.configuration import (
    PlatformConfiguration,
)
from app.modules.platform.domains.configuration.repositories.configuration import (
    ConfigurationRepository,
)
from app.modules.platform.domains.configuration.schemas.configuration import (
    ConfigurationUpdateRequest,
)
from app.modules.platform.domains.events import ConfigurationUpdated


class ConfigurationService:
    def __init__(self, repo: ConfigurationRepository):
        self.repo = repo

    async def get_value(self, tenant_id: uuid.UUID | None, key: str) -> str:
        config = await self.repo.get_by_key(key, tenant_id)
        if not config:
            raise BusinessException(
                "ENTITY_NOT_FOUND", f"Configuration key '{key}' not found"
            )
        return config.value

    async def update_value(
        self, company_id: uuid.UUID, payload: ConfigurationUpdateRequest
    ) -> PlatformConfiguration:
        config = await self.repo.get_by_key(payload.key, payload.tenant_id)
        if config:
            config.value = payload.value
            config.version += 1
        else:
            config = PlatformConfiguration(
                tenant_id=payload.tenant_id,
                key=payload.key,
                value=payload.value,
                is_global=payload.is_global,
                version=1,
            )
        saved = await self.repo.create(config)

        await publish_platform_event(
            ConfigurationUpdated(
                tenant_id=payload.tenant_id,
                payload={"key": saved.key, "version": saved.version},
            )
        )
        return saved
