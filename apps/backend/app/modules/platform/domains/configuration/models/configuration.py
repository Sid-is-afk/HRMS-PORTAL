import uuid

from sqlalchemy import UUID, Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin, UUIDMixin


class PlatformConfiguration(
    Base, UUIDMixin, TimestampMixin, AuditMixin, SoftDeleteMixin
):
    __tablename__ = "platform_configurations"

    tenant_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True, index=True
    )
    key: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    value: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    is_global: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
