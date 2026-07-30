import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import JSON, UUID, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin, UUIDMixin


class Attendance(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin, AuditMixin):
    __tablename__ = "attendance_records"

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    employee_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    check_in: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    check_out: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    breaks: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    overtime: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Present", nullable=False)
    workflow_state: Mapped[str] = mapped_column(
        String(50), default="Draft", nullable=False
    )
