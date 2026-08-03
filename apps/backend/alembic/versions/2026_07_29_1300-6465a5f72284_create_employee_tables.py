"""create_employee_tables

Revision ID: 6465a5f72284
Revises: 5465a5f72283
Create Date: 2026-07-29 13:00:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "6465a5f72284"
down_revision: str | None = "5465a5f72283"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 1. employees table
    op.create_table(
        "employees",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("identity_id", sa.UUID(), nullable=True),
        sa.Column("employee_code", sa.String(length=20), nullable=False),
        sa.Column("first_name", sa.String(length=80), nullable=False),
        sa.Column("middle_name", sa.String(length=80), nullable=True),
        sa.Column("last_name", sa.String(length=80), nullable=False),
        sa.Column("preferred_name", sa.String(length=80), nullable=True),
        sa.Column("gender", sa.String(length=20), nullable=True),
        sa.Column("date_of_birth", sa.Date(), nullable=True),
        sa.Column("nationality", sa.String(length=50), nullable=True),
        sa.Column("profile_photo", sa.String(length=255), nullable=True),
        sa.Column(
            "employment_status",
            sa.String(length=50),
            nullable=False,
            server_default="ACTIVE",
        ),
        sa.Column("employment_type", sa.String(length=50), nullable=True),
        sa.Column("department", sa.String(length=100), nullable=True),
        sa.Column("designation", sa.String(length=100), nullable=True),
        sa.Column("manager_id", sa.UUID(), nullable=True),
        sa.Column("joining_date", sa.Date(), nullable=False),
        sa.Column("confirmation_date", sa.Date(), nullable=True),
        sa.Column("work_location", sa.String(length=100), nullable=True),
        sa.Column("organization_unit", sa.String(length=100), nullable=True),
        sa.Column("profile_info", sa.JSON(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(
            ["identity_id"],
            ["identities.id"],
            name=op.f("fk_employees_identity_id_identities"),
        ),
        sa.ForeignKeyConstraint(
            ["manager_id"],
            ["employees.id"],
            name=op.f("fk_employees_manager_id_employees"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_employees")),
        sa.UniqueConstraint(
            "company_id", "employee_code", name=op.f("uq_employees_company_code")
        ),
    )

    # 2. contact_informations table
    op.create_table(
        "contact_informations",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("primary_email", sa.String(length=150), nullable=False),
        sa.Column("secondary_email", sa.String(length=150), nullable=True),
        sa.Column("primary_phone", sa.String(length=20), nullable=False),
        sa.Column("secondary_phone", sa.String(length=20), nullable=True),
        sa.Column("current_address", sa.String(length=500), nullable=True),
        sa.Column("permanent_address", sa.String(length=500), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
            name=op.f("fk_contact_informations_employee_id_employees"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_contact_informations")),
        sa.UniqueConstraint(
            "primary_email", name=op.f("uq_contact_informations_primary_email")
        ),
    )

    # 3. employments table
    op.create_table(
        "employments",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column(
            "employment_status",
            sa.String(length=50),
            nullable=False,
            server_default="ACTIVE",
        ),
        sa.Column("employment_type", sa.String(length=50), nullable=True),
        sa.Column("reporting_manager_id", sa.UUID(), nullable=True),
        sa.Column("department", sa.String(length=100), nullable=True),
        sa.Column("designation", sa.String(length=100), nullable=True),
        sa.Column("business_unit", sa.String(length=100), nullable=True),
        sa.Column("organization_unit", sa.String(length=100), nullable=True),
        sa.Column("joining_date", sa.Date(), nullable=False),
        sa.Column("confirmation_date", sa.Date(), nullable=True),
        sa.Column("exit_date", sa.Date(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
            name=op.f("fk_employments_employee_id_employees"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["reporting_manager_id"],
            ["employees.id"],
            name=op.f("fk_employments_reporting_manager_id_employees"),
            ondelete="SET NULL",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_employments")),
    )

    # 4. emergency_contacts table
    op.create_table(
        "emergency_contacts",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("relationship", sa.String(length=50), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=True),
        sa.Column("priority", sa.Integer(), nullable=False, server_default="1"),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
            name=op.f("fk_emergency_contacts_employee_id_employees"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_emergency_contacts")),
    )

    # 5. bank_informations table
    op.create_table(
        "bank_informations",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("bank_name", sa.String(length=100), nullable=False),
        sa.Column("account_holder", sa.String(length=150), nullable=False),
        sa.Column("account_number", sa.String(length=50), nullable=False),
        sa.Column("ifsc", sa.String(length=20), nullable=False),
        sa.Column("branch", sa.String(length=100), nullable=False),
        sa.Column(
            "primary_account", sa.Boolean(), nullable=False, server_default="false"
        ),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
            name=op.f("fk_bank_informations_employee_id_employees"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_bank_informations")),
    )

    # 6. employee_documents table
    op.create_table(
        "employee_documents",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("document_type", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("storage_reference", sa.String(length=255), nullable=False),
        sa.Column(
            "verification_status",
            sa.String(length=50),
            nullable=False,
            server_default="PENDING",
        ),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
            name=op.f("fk_employee_documents_employee_id_employees"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_employee_documents")),
    )

    # Create indexes for fast lookup and tenant isolation
    op.create_index("ix_employees_company_id", "employees", ["company_id"])
    op.create_index("ix_employees_employee_code", "employees", ["employee_code"])
    op.create_index("ix_employees_department", "employees", ["department"])
    op.create_index("ix_employees_designation", "employees", ["designation"])
    op.create_index(
        "ix_employees_employment_status", "employees", ["employment_status"]
    )
    op.create_index("ix_employees_manager_id", "employees", ["manager_id"])
    op.create_index(
        "ix_contact_informations_employee_id", "contact_informations", ["employee_id"]
    )
    op.create_index("ix_employments_employee_id", "employments", ["employee_id"])
    op.create_index(
        "ix_emergency_contacts_employee_id", "emergency_contacts", ["employee_id"]
    )
    op.create_index(
        "ix_bank_informations_employee_id", "bank_informations", ["employee_id"]
    )
    op.create_index(
        "ix_employee_documents_employee_id", "employee_documents", ["employee_id"]
    )


def downgrade() -> None:
    op.drop_index("ix_employee_documents_employee_id", table_name="employee_documents")
    op.drop_index("ix_bank_informations_employee_id", table_name="bank_informations")
    op.drop_index("ix_emergency_contacts_employee_id", table_name="emergency_contacts")
    op.drop_index("ix_employments_employee_id", table_name="employments")
    op.drop_index(
        "ix_contact_informations_employee_id", table_name="contact_informations"
    )
    op.drop_index("ix_employees_manager_id", table_name="employees")
    op.drop_index("ix_employees_employment_status", table_name="employees")
    op.drop_index("ix_employees_designation", table_name="employees")
    op.drop_index("ix_employees_department", table_name="employees")
    op.drop_index("ix_employees_employee_code", table_name="employees")
    op.drop_index("ix_employees_company_id", table_name="employees")

    op.drop_table("employee_documents")
    op.drop_table("bank_informations")
    op.drop_table("emergency_contacts")
    op.drop_table("employments")
    op.drop_table("contact_informations")
    op.drop_table("employees")
