from sqlalchemy import Integer
from sqlalchemy.orm import Mapped, mapped_column


class VersionMixin:
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    __mapper_args__ = {"version_id_col": version}
