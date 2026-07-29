import uuid

from app.modules.auth.domains.users.models.user import User
from app.modules.auth.domains.users.repositories.user import UserRepository


class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def get_by_identity_id(self, identity_id: uuid.UUID) -> User | None:
        return await self.repository.get_by_identity_id(identity_id)

    async def create_user(self, user: User) -> User:
        return await self.repository.create(user)
