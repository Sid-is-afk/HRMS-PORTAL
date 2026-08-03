import uuid
from collections.abc import Sequence
from typing import Any

from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession


class BaseRepository[ModelType]:
    def __init__(self, model: type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def get_by_id(self, id: uuid.UUID) -> ModelType | None:
        return await self.session.get(self.model, id)

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[ModelType]:
        stmt = select(self.model).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def create(self, obj: ModelType) -> ModelType:
        self.session.add(obj)
        await self.session.flush()
        await self.session.refresh(obj)
        return obj

    async def update_by_id(self, id: uuid.UUID, **kwargs: Any) -> None:
        current_version = kwargs.pop("current_version", None)
        stmt = update(self.model).where(self.model.id == id)  # type: ignore[attr-defined]

        from app.core.exceptions.base import ConcurrencyException

        if hasattr(self.model, "version") and current_version is not None:
            stmt = stmt.where(self.model.version == current_version).values(  # type: ignore[attr-defined]
                version=current_version + 1
            )

        stmt = stmt.values(**kwargs)
        res = await self.session.execute(stmt)

        if hasattr(self.model, "version") and current_version is not None:
            if res.rowcount == 0:  # type: ignore[attr-defined]
                raise ConcurrencyException(
                    "CONCURRENT_UPDATE", "stale data: concurrent update detected"
                )

    async def delete_by_id(self, id: uuid.UUID) -> None:
        stmt = delete(self.model).where(self.model.id == id)  # type: ignore[attr-defined]
        await self.session.execute(stmt)
