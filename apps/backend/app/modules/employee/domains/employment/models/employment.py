import uuid
from datetime import date

from sqlalchemy import UUID, Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDMixin


class Employment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "employments"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False,
    )
    employment_status: Mapped[str] = mapped_column(
        String(50), default="ACTIVE", nullable=False
    )
    employment_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    reporting_manager_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employees.id", ondelete="SET NULL"),
        nullable=True,
    )
    department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    designation: Mapped[str | None] = mapped_column(String(100), nullable=True)
    business_unit: Mapped[str | None] = mapped_column(String(100), nullable=True)
    organization_unit: Mapped[str | None] = mapped_column(String(100), nullable=True)
    joining_date: Mapped[date] = mapped_column(Date, nullable=False)
    confirmation_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    exit_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    employee = relationship(
        "Employee", back_populates="employment", foreign_keys=[employee_id]
    )
    reporting_manager = relationship("Employee", foreign_keys=[reporting_manager_id])
