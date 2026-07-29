import uuid

from sqlalchemy import UUID, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship as sa_relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDMixin


class EmergencyContact(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "emergency_contacts"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    relationship: Mapped[str] = mapped_column(String(50), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str | None] = mapped_column(String(150), nullable=True)
    priority: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    employee = sa_relationship("Employee", back_populates="emergency_contacts")
