from typing import Any
import uuid
from datetime import date

from sqlalchemy import JSON, UUID, Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin, UUIDMixin


class Employee(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin, AuditMixin):
    __tablename__ = "employees"

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    identity_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("identities.id"), nullable=True
    )
    employee_code: Mapped[str] = mapped_column(String(20), nullable=False)
    first_name: Mapped[str] = mapped_column(String(80), nullable=False)
    middle_name: Mapped[str | None] = mapped_column(String(80), nullable=True)
    last_name: Mapped[str] = mapped_column(String(80), nullable=False)
    preferred_name: Mapped[str | None] = mapped_column(String(80), nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    nationality: Mapped[str | None] = mapped_column(String(50), nullable=True)
    profile_photo: Mapped[str | None] = mapped_column(String(255), nullable=True)
    employment_status: Mapped[str] = mapped_column(
        String(50), default="ACTIVE", nullable=False
    )
    employment_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    designation: Mapped[str | None] = mapped_column(String(100), nullable=True)
    manager_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("employees.id"), nullable=True
    )
    joining_date: Mapped[date] = mapped_column(Date, nullable=False)
    confirmation_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    work_location: Mapped[str | None] = mapped_column(String(100), nullable=True)
    organization_unit: Mapped[str | None] = mapped_column(String(100), nullable=True)
    profile_info: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    contact_info = relationship(
        "ContactInformation",
        back_populates="employee",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    employment = relationship(
        "Employment",
        back_populates="employee",
        foreign_keys="[Employment.employee_id]",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    emergency_contacts = relationship(
        "EmergencyContact",
        back_populates="employee",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    bank_info = relationship(
        "BankInformation",
        back_populates="employee",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    documents = relationship(
        "EmployeeDocument",
        back_populates="employee",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
