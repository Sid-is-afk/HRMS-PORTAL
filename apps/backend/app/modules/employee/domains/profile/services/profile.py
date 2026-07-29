import uuid
from typing import Any

from app.core.exceptions.base import NotFoundException
from app.modules.employee.domains.profile.repositories.employee import (
    EmployeeRepository,
)


class ProfileService:
    def __init__(self, employee_repo: EmployeeRepository):
        self.employee_repo = employee_repo

    async def get_profile(
        self, company_id: uuid.UUID, employee_id: uuid.UUID
    ) -> dict[str, Any]:
        employee = await self.employee_repo.get_by_id(employee_id)
        if (
            not employee
            or employee.company_id != company_id
            or employee.deleted_at is not None
        ):
            raise NotFoundException("EMPLOYEE_NOT_FOUND", "Employee not found")

        # Map to profile dict
        profile_data = employee.profile_info or {}
        return {
            "id": employee.id,
            "employee_code": employee.employee_code,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "profile_photo": employee.profile_photo,
            "department": employee.department,
            "designation": employee.designation,
            "joining_date": employee.joining_date,
            "bio": profile_data.get("bio", ""),
            "languages": profile_data.get("languages", []),
            "skills": profile_data.get("skills", []),
        }

    async def update_profile(
        self,
        company_id: uuid.UUID,
        employee_id: uuid.UUID,
        bio: str | None = None,
        languages: list[str] | None = None,
        skills: list[str] | None = None,
        profile_photo: str | None = None,
    ) -> dict[str, Any]:
        employee = await self.employee_repo.get_by_id(employee_id)
        if (
            not employee
            or employee.company_id != company_id
            or employee.deleted_at is not None
        ):
            raise NotFoundException("EMPLOYEE_NOT_FOUND", "Employee not found")

        profile_data = dict(
            employee.profile_info or {"bio": "", "languages": [], "skills": []}
        )
        if bio is not None:
            profile_data["bio"] = bio
        if languages is not None:
            profile_data["languages"] = languages
        if skills is not None:
            profile_data["skills"] = skills

        employee.profile_info = profile_data

        if profile_photo is not None:
            employee.profile_photo = profile_photo

        await self.employee_repo.create(employee)

        return {
            "id": employee.id,
            "employee_code": employee.employee_code,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "profile_photo": employee.profile_photo,
            "department": employee.department,
            "designation": employee.designation,
            "joining_date": employee.joining_date,
            "bio": profile_data.get("bio", ""),
            "languages": profile_data.get("languages", []),
            "skills": profile_data.get("skills", []),
        }
