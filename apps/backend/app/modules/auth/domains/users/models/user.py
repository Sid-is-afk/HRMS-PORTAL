import uuid
from typing import Any

from sqlalchemy import JSON, UUID, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import SoftDeleteMixin, TimestampMixin, UUIDMixin


class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    identity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("identities.id"), nullable=False
    )
    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    display_name: Mapped[str] = mapped_column(String(150), nullable=False)
    avatar: Mapped[str | None] = mapped_column(String(255), nullable=True)
    profile_info: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    identity = relationship("Identity", backref="users")
