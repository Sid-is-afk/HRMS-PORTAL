import uuid
from datetime import date

from sqlalchemy import UUID, Date, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin, UUIDMixin


class Holiday(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin, AuditMixin):
    __tablename__ = "holidays"

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    holiday_date: Mapped[date] = mapped_column(Date, nullable=False)
    holiday_type: Mapped[str] = mapped_column(
        String(50), default="Organization", nullable=False
    )
