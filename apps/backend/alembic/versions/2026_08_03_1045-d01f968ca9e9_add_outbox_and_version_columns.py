"""add_outbox_and_version_columns

Revision ID: d01f968ca9e9
Revises: dc8b117bf393
Create Date: 2026-08-03 10:45:21.920786

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d01f968ca9e9"
down_revision: str | None = "dc8b117bf393"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 1. Create outbox_events table
    op.create_table(
        "outbox_events",
        sa.Column("id", sa.UUID(as_uuid=True), nullable=False),
        sa.Column("event_id", sa.UUID(as_uuid=True), nullable=False),
        sa.Column("event_type", sa.String(length=100), nullable=False),
        sa.Column("tenant_id", sa.UUID(as_uuid=True), nullable=True),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column(
            "status", sa.String(length=50), nullable=False, server_default="Pending"
        ),
        sa.Column("retry_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("error_message", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column("processed_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("event_id"),
    )
    op.create_index(
        "ix_outbox_events_tenant_id", "outbox_events", ["tenant_id"], unique=False
    )

    # 2. Add version columns with server default of 1 to support optimistic concurrency control
    op.add_column(
        "attendance_records",
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )
    op.add_column(
        "employees",
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )
    op.add_column(
        "job_openings",
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )
    op.add_column(
        "leave_requests",
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )
    op.add_column(
        "promotions",
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )
    op.add_column(
        "tenants",
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )
    op.add_column(
        "transfers",
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )


def downgrade() -> None:
    # 1. Drop version columns
    op.drop_column("transfers", "version")
    op.drop_column("tenants", "version")
    op.drop_column("promotions", "version")
    op.drop_column("leave_requests", "version")
    op.drop_column("job_openings", "version")
    op.drop_column("employees", "version")
    op.drop_column("attendance_records", "version")

    # 2. Drop outbox_events table
    op.drop_index("ix_outbox_events_tenant_id", table_name="outbox_events")
    op.drop_table("outbox_events")
