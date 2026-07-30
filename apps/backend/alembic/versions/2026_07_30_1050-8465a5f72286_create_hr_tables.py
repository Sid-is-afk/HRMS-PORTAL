"""create_hr_tables

Revision ID: 8465a5f72286
Revises: 7465a5f72285
Create Date: 2026-07-30 10:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8465a5f72286'
down_revision: Union[str, None] = '7465a5f72285'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. attendance_records
    op.create_table(
        "attendance_records",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("check_in", sa.DateTime(), nullable=False),
        sa.Column("check_out", sa.DateTime(), nullable=True),
        sa.Column("breaks", sa.JSON(), nullable=True),
        sa.Column("overtime", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="Present"),
        sa.Column("workflow_state", sa.String(length=50), nullable=False, server_default="Draft"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_attendance_records")),
    )
    op.create_index("ix_attendance_records_company_id", "attendance_records", ["company_id"])
    op.create_index("ix_attendance_records_employee_id", "attendance_records", ["employee_id"])

    # 2. leave_types
    op.create_table(
        "leave_types",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("code", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_leave_types")),
    )
    op.create_index("ix_leave_types_company_id", "leave_types", ["company_id"])

    # 3. leave_balances
    op.create_table(
        "leave_balances",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("leave_type_id", sa.UUID(), nullable=False),
        sa.Column("balance", sa.Float(), nullable=False, server_default="0.0"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(["leave_type_id"], ["leave_types.id"], name=op.f("fk_leave_balances_leave_type_id_leave_types"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_leave_balances")),
    )
    op.create_index("ix_leave_balances_company_id", "leave_balances", ["company_id"])
    op.create_index("ix_leave_balances_employee_id", "leave_balances", ["employee_id"])

    # 4. leave_requests
    op.create_table(
        "leave_requests",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("leave_type_id", sa.UUID(), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=False),
        sa.Column("workflow_state", sa.String(length=50), nullable=False, server_default="Draft"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(["leave_type_id"], ["leave_types.id"], name=op.f("fk_leave_requests_leave_type_id_leave_types")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_leave_requests")),
    )
    op.create_index("ix_leave_requests_company_id", "leave_requests", ["company_id"])
    op.create_index("ix_leave_requests_employee_id", "leave_requests", ["employee_id"])

    # 5. shifts
    op.create_table(
        "shifts",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("code", sa.String(length=20), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_shifts")),
    )
    op.create_index("ix_shifts_company_id", "shifts", ["company_id"])

    # 6. shift_assignments
    op.create_table(
        "shift_assignments",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("shift_id", sa.UUID(), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(["shift_id"], ["shifts.id"], name=op.f("fk_shift_assignments_shift_id_shifts"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_shift_assignments")),
    )
    op.create_index("ix_shift_assignments_company_id", "shift_assignments", ["company_id"])
    op.create_index("ix_shift_assignments_employee_id", "shift_assignments", ["employee_id"])

    # 7. holidays
    op.create_table(
        "holidays",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("holiday_date", sa.Date(), nullable=False),
        sa.Column("holiday_type", sa.String(length=50), nullable=False, server_default="Organization"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_holidays")),
    )
    op.create_index("ix_holidays_company_id", "holidays", ["company_id"])

    # 8. job_openings
    op.create_table(
        "job_openings",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=100), nullable=False),
        sa.Column("department_id", sa.UUID(), nullable=False),
        sa.Column("workflow_state", sa.String(length=50), nullable=False, server_default="Draft"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_job_openings")),
    )
    op.create_index("ix_job_openings_company_id", "job_openings", ["company_id"])

    # 9. candidates
    op.create_table(
        "candidates",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("job_opening_id", sa.UUID(), nullable=False),
        sa.Column("first_name", sa.String(length=50), nullable=False),
        sa.Column("last_name", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=100), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="Applied"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(["job_opening_id"], ["job_openings.id"], name=op.f("fk_candidates_job_opening_id_job_openings"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_candidates")),
    )
    op.create_index("ix_candidates_company_id", "candidates", ["company_id"])

    # 10. interviews
    op.create_table(
        "interviews",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("candidate_id", sa.UUID(), nullable=False),
        sa.Column("interviewer_id", sa.UUID(), nullable=False),
        sa.Column("interview_date", sa.DateTime(), nullable=False),
        sa.Column("feedback", sa.String(length=255), nullable=True),
        sa.Column("rating", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(["candidate_id"], ["candidates.id"], name=op.f("fk_interviews_candidate_id_candidates"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_interviews")),
    )
    op.create_index("ix_interviews_company_id", "interviews", ["company_id"])

    # 11. offers
    op.create_table(
        "offers",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("candidate_id", sa.UUID(), nullable=False),
        sa.Column("offered_position_id", sa.UUID(), nullable=False),
        sa.Column("salary", sa.Float(), nullable=False),
        sa.Column("joining_date", sa.Date(), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="Pending"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(["candidate_id"], ["candidates.id"], name=op.f("fk_offers_candidate_id_candidates"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_offers")),
    )
    op.create_index("ix_offers_company_id", "offers", ["company_id"])

    # 12. onboarding_processes
    op.create_table(
        "onboarding_processes",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("buddy_id", sa.UUID(), nullable=True),
        sa.Column("workflow_state", sa.String(length=50), nullable=False, server_default="Created"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_onboarding_processes")),
    )
    op.create_index("ix_onboarding_processes_company_id", "onboarding_processes", ["company_id"])

    # 13. offboarding_processes
    op.create_table(
        "offboarding_processes",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("resignation_date", sa.Date(), nullable=False),
        sa.Column("workflow_state", sa.String(length=50), nullable=False, server_default="Requested"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_offboarding_processes")),
    )
    op.create_index("ix_offboarding_processes_company_id", "offboarding_processes", ["company_id"])

    # 14. promotions
    op.create_table(
        "promotions",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("current_designation_id", sa.UUID(), nullable=False),
        sa.Column("proposed_designation_id", sa.UUID(), nullable=False),
        sa.Column("effective_date", sa.Date(), nullable=False),
        sa.Column("workflow_state", sa.String(length=50), nullable=False, server_default="Draft"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_promotions")),
    )
    op.create_index("ix_promotions_company_id", "promotions", ["company_id"])

    # 15. transfers
    op.create_table(
        "transfers",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("current_department_id", sa.UUID(), nullable=False),
        sa.Column("proposed_department_id", sa.UUID(), nullable=False),
        sa.Column("proposed_manager_id", sa.UUID(), nullable=False),
        sa.Column("effective_date", sa.Date(), nullable=False),
        sa.Column("workflow_state", sa.String(length=50), nullable=False, server_default="Draft"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_transfers")),
    )
    op.create_index("ix_transfers_company_id", "transfers", ["company_id"])

    # 16. performance_reviews
    op.create_table(
        "performance_reviews",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("employee_id", sa.UUID(), nullable=False),
        sa.Column("reviewer_id", sa.UUID(), nullable=False),
        sa.Column("rating", sa.Float(), nullable=True),
        sa.Column("feedback", sa.String(length=255), nullable=True),
        sa.Column("workflow_state", sa.String(length=50), nullable=False, server_default="Draft"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_performance_reviews")),
    )
    op.create_index("ix_performance_reviews_company_id", "performance_reviews", ["company_id"])

    # 17. trainings
    op.create_table(
        "trainings",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.Column("trainer", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_trainings")),
    )
    op.create_index("ix_trainings_company_id", "trainings", ["company_id"])

    # 18. audit_timelines
    op.create_table(
        "audit_timelines",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("company_id", sa.UUID(), nullable=False),
        sa.Column("entity_type", sa.String(length=100), nullable=False),
        sa.Column("entity_id", sa.UUID(), nullable=False),
        sa.Column("previous_state", sa.String(length=50), nullable=False),
        sa.Column("new_state", sa.String(length=50), nullable=False),
        sa.Column("actor_id", sa.UUID(), nullable=True),
        sa.Column("comment", sa.String(length=255), nullable=True),
        sa.Column("reason", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_audit_timelines")),
    )
    op.create_index("ix_audit_timelines_company_id", "audit_timelines", ["company_id"])
    op.create_index("ix_audit_timelines_entity_id", "audit_timelines", ["entity_id"])


def downgrade() -> None:
    op.drop_table("audit_timelines")
    op.drop_table("trainings")
    op.drop_table("performance_reviews")
    op.drop_table("transfers")
    op.drop_table("promotions")
    op.drop_table("offboarding_processes")
    op.drop_table("onboarding_processes")
    op.drop_table("offers")
    op.drop_table("interviews")
    op.drop_table("candidates")
    op.drop_table("job_openings")
    op.drop_table("holidays")
    op.drop_table("shift_assignments")
    op.drop_table("shifts")
    op.drop_table("leave_requests")
    op.drop_table("leave_balances")
    op.drop_table("leave_types")
    op.drop_table("attendance_records")
