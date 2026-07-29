from typing import Any
import uuid
from datetime import date

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database.repository import BaseRepository
from app.modules.employee.domains.contacts.models.contact import ContactInformation
from app.modules.employee.domains.profile.models.employee import Employee


class EmployeeRepository(BaseRepository[Employee]):
    def __init__(self, session: AsyncSession):
        super().__init__(Employee, session)

    async def get_by_id_with_relations(self, employee_id: uuid.UUID) -> Employee | None:
        stmt = (
            select(Employee)
            .where(Employee.id == employee_id, Employee.deleted_at.is_(None))
            .options(
                selectinload(Employee.contact_info),
                selectinload(Employee.employment),
                selectinload(Employee.emergency_contacts),
                selectinload(Employee.bank_info),
                selectinload(Employee.documents),
            )
            .execution_options(populate_existing=True)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_code(self, company_id: uuid.UUID, code: str) -> Employee | None:
        stmt = select(Employee).where(
            Employee.company_id == company_id,
            Employee.employee_code == code,
            Employee.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_paginated(
        self,
        company_id: uuid.UUID,
        page: int,
        size: int,
        search: str | None = None,
        department: str | None = None,
        employment_type: str | None = None,
        employment_status: str | None = None,
        organization_unit: str | None = None,
        joining_date: date | None = None,
        manager_id: uuid.UUID | None = None,
        sort_by: str | None = None,
        sort_order: str = "asc",
    ) -> tuple[list[Employee], int]:
        stmt = select(Employee).where(
            Employee.company_id == company_id, Employee.deleted_at.is_(None)
        )

        # Filters
        if department:
            stmt = stmt.where(Employee.department == department)
        if employment_type:
            stmt = stmt.where(Employee.employment_type == employment_type)
        if employment_status:
            stmt = stmt.where(Employee.employment_status == employment_status)
        if organization_unit:
            stmt = stmt.where(Employee.organization_unit == organization_unit)
        if joining_date:
            stmt = stmt.where(Employee.joining_date == joining_date)
        if manager_id:
            stmt = stmt.where(Employee.manager_id == manager_id)

        # Search (Employee code, Name, Email, Department,
        # Designation, Manager name/status)
        if search:
            # We can join contact_info for email search
            stmt = stmt.outerjoin(Employee.contact_info)
            stmt = stmt.where(
                or_(
                    Employee.employee_code.ilike(f"%{search}%"),
                    Employee.first_name.ilike(f"%{search}%"),
                    Employee.last_name.ilike(f"%{search}%"),
                    Employee.department.ilike(f"%{search}%"),
                    Employee.designation.ilike(f"%{search}%"),
                    Employee.employment_status.ilike(f"%{search}%"),
                    ContactInformation.primary_email.ilike(f"%{search}%"),
                )
            )

        # Count total records matching filters
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.session.execute(count_stmt)
        total_records = count_result.scalar() or 0

        # Sorting
        order_col: Any
        if sort_by == "name":
            order_col = Employee.first_name
        elif sort_by == "joining_date":
            order_col = Employee.joining_date
        elif sort_by == "employee_code":
            order_col = Employee.employee_code
        elif sort_by == "department":
            order_col = Employee.department
        else:
            order_col = Employee.created_at

        if sort_order == "desc":
            stmt = stmt.order_by(order_col.desc())
        else:
            stmt = stmt.order_by(order_col.asc())

        # Pagination
        offset = (page - 1) * size
        stmt = stmt.offset(offset).limit(size)

        # Load relations eagerly
        stmt = stmt.options(
            selectinload(Employee.contact_info),
            selectinload(Employee.employment),
            selectinload(Employee.emergency_contacts),
            selectinload(Employee.bank_info),
            selectinload(Employee.documents),
        )

        result = await self.session.execute(stmt)
        employees = list(result.scalars().all())

        return employees, total_records
