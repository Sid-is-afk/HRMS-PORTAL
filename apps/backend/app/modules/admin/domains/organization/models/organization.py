import uuid
from datetime import date

from sqlalchemy import UUID, Boolean, Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin, UUIDMixin


class Organization(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin, AuditMixin):
    __tablename__ = "organizations"

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(20), nullable=False)
    org_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", nullable=False)
    parent_organization_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True
    )
    effective_from: Mapped[date] = mapped_column(Date, nullable=False)
    effective_to: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    parent_organization = relationship(
        "Organization",
        remote_side="Organization.id",
        back_populates="sub_organizations",
        foreign_keys=[parent_organization_id],
    )
    sub_organizations = relationship(
        "Organization",
        back_populates="parent_organization",
        foreign_keys=[parent_organization_id],
    )
    business_units = relationship(
        "BusinessUnit",
        back_populates="organization",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    branches = relationship(
        "Branch",
        back_populates="organization",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    cost_centers = relationship(
        "CostCenter",
        back_populates="organization",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
