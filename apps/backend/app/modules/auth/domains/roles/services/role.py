from app.modules.auth.domains.roles.models.role import Role
from app.modules.auth.domains.roles.repositories.role import RoleRepository


class RoleService:
    def __init__(self, repository: RoleRepository):
        self.repository = repository

    async def get_by_name(self, name: str) -> Role | None:
        return await self.repository.get_by_name(name)

    async def create_role(self, role: Role) -> Role:
        return await self.repository.create(role)
