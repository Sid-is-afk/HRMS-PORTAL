import uuid

from sqlalchemy import UUID, Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDMixin


class BankInformation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "bank_informations"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False,
    )
    bank_name: Mapped[str] = mapped_column(String(100), nullable=False)
    account_holder: Mapped[str] = mapped_column(String(150), nullable=False)
    account_number: Mapped[str] = mapped_column(String(50), nullable=False)
    ifsc: Mapped[str] = mapped_column(String(20), nullable=False)
    branch: Mapped[str] = mapped_column(String(100), nullable=False)
    primary_account: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    employee = relationship("Employee", back_populates="bank_info")
