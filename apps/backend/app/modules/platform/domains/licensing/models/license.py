from datetime import datetime
from typing import Any
from sqlalchemy import JSON, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import UUIDMixin
from app.database.tenant_mixin import HasTenant


class License(Base, UUIDMixin, HasTenant):
    __tablename__ = "licenses"

    plan: Mapped[str] = mapped_column(String(50), nullable=False)
    features: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    user_limits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    storage_limits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    api_limits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
