import uuid

from sqlalchemy import UUID, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import SoftDeleteMixin, TimestampMixin, UUIDMixin


class Tenant(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tenants"

    tenant_code: Mapped[str] = mapped_column(
        String(50), unique=True, index=True, nullable=False
    )
    tenant_name: Mapped[str] = mapped_column(String(150), nullable=False)
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(50), default="Active", nullable=False
    )  # Active, Suspended, Inactive
    subscription_plan: Mapped[str] = mapped_column(
        String(50), default="Free", nullable=False
    )
    license_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True
    )
    provisioning_status: Mapped[str] = mapped_column(
        String(50), default="Pending", nullable=False
    )  # Pending, Provisioning, Completed, Failed
