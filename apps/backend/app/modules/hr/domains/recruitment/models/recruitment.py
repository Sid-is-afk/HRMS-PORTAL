import uuid

from sqlalchemy import UUID, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin, UUIDMixin


class Recruitment(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin, AuditMixin):
    __tablename__ = "job_openings"

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    department_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    workflow_state: Mapped[str] = mapped_column(
        String(50), default="Draft", nullable=False
    )
