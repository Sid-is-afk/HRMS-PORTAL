import uuid

from app.modules.auth.domains.identity.models.identity import Identity
from app.modules.auth.domains.identity.repositories.identity import IdentityRepository


class IdentityService:
    def __init__(self, repository: IdentityRepository):
        self.repository = repository

    async def get_by_id(self, identity_id: uuid.UUID) -> Identity | None:
        return await self.repository.get_by_id(identity_id)

    async def get_by_email(self, email: str) -> Identity | None:
        return await self.repository.get_by_email(email)

    async def update_identity(self, identity: Identity) -> Identity:
        await self.repository.create(identity)
        return identity
