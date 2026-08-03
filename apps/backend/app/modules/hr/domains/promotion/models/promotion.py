import uuid
from datetime import date

from sqlalchemy import UUID, Date, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin, UUIDMixin
from app.database.version_mixin import VersionMixin


class Promotion(
    Base, UUIDMixin, TimestampMixin, SoftDeleteMixin, AuditMixin, VersionMixin
):
    __tablename__ = "promotions"

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    employee_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    current_designation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False
    )
    proposed_designation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False
    )
    effective_date: Mapped[date] = mapped_column(Date, nullable=False)
    workflow_state: Mapped[str] = mapped_column(
        String(50), default="Draft", nullable=False
    )
