import uuid

from sqlalchemy import UUID, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDMixin


class ContactInformation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "contact_informations"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False,
    )
    primary_email: Mapped[str] = mapped_column(String(150), nullable=False)
    secondary_email: Mapped[str | None] = mapped_column(String(150), nullable=True)
    primary_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    secondary_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    current_address: Mapped[str | None] = mapped_column(String(500), nullable=True)
    permanent_address: Mapped[str | None] = mapped_column(String(500), nullable=True)

    employee = relationship("Employee", back_populates="contact_info")
