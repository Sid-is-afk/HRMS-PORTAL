from app.modules.auth.domains.permissions.models.permission import Permission
from app.modules.auth.domains.permissions.repositories.permission import (
    PermissionRepository,
)


class PermissionService:
    def __init__(self, repository: PermissionRepository):
        self.repository = repository

    async def get_by_name(self, name: str) -> Permission | None:
        return await self.repository.get_by_name(name)

    async def create_permission(self, permission: Permission) -> Permission:
        return await self.repository.create(permission)
