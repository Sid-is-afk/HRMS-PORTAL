import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import JSON, UUID, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import UUIDMixin


class OutboxEvent(Base, UUIDMixin):
    __tablename__ = "outbox_events"

    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4
    )
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    tenant_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True, index=True
    )
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default="Pending", nullable=False
    )  # Pending, Processed, Failed
    retry_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    error_message: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
    processed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
