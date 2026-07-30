import uuid

from sqlalchemy import UUID, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin, UUIDMixin


class Candidate(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin, AuditMixin):
    __tablename__ = "candidates"

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    job_opening_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("job_openings.id", ondelete="CASCADE"),
        nullable=False,
    )
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Applied", nullable=False)
