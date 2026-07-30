import uuid
from datetime import datetime

from sqlalchemy import UUID, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin, UUIDMixin


class Interview(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin, AuditMixin):
    __tablename__ = "interviews"

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
    )
    interviewer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False
    )
    interview_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    feedback: Mapped[str | None] = mapped_column(String(255), nullable=True)
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
