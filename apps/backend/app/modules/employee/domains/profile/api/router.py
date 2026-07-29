import uuid
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import PermissionGuard, get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.employee.domains.bank.repositories.bank import BankRepository
from app.modules.employee.domains.contacts.repositories.contact import ContactRepository
from app.modules.employee.domains.documents.repositories.document import (
    DocumentRepository,
)
from app.modules.employee.domains.emergency.repositories.emergency import (
    EmergencyRepository,
)
from app.modules.employee.domains.employment.repositories.employment import (
    EmploymentRepository,
)
from app.modules.employee.domains.profile.repositories.employee import (
    EmployeeRepository,
)
from app.modules.employee.domains.profile.schemas.schemas import (
    EmployeeCreateRequest,
    EmployeeFullResponse,
    EmployeeProfileResponse,
    EmployeeProfileUpdateRequest,
    EmployeeSummaryResponse,
    EmployeeUpdateRequest,
)
from app.modules.employee.domains.profile.services.employee import EmployeeService
from app.modules.employee.domains.profile.services.profile import ProfileService
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/employees", tags=["Employees"])


async def get_employee_service(db: AsyncSession = Depends(get_db)) -> EmployeeService:
    return EmployeeService(
        employee_repo=EmployeeRepository(db),
        contact_repo=ContactRepository(db),
        employment_repo=EmploymentRepository(db),
        emergency_repo=EmergencyRepository(db),
        bank_repo=BankRepository(db),
        document_repo=DocumentRepository(db),
    )


async def get_profile_service(db: AsyncSession = Depends(get_db)) -> ProfileService:
    return ProfileService(employee_repo=EmployeeRepository(db))


@router.post(
    "",
    response_model=SuccessResponse[EmployeeFullResponse],
    dependencies=[Depends(PermissionGuard("employee:create"))],
    summary="Create Employee",
)
async def create_employee(
    payload: EmployeeCreateRequest,
    current_user: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service),
) -> Any:
    # Set company_id from current authenticated user context (multi-tenancy)
    employee = await service.create_employee(
        company_id=current_user.company_id, payload=payload, actor_id=current_user.id
    )
    return SuccessResponse(data=employee)


@router.get(
    "",
    response_model=SuccessResponse[list[EmployeeSummaryResponse]],
    dependencies=[Depends(PermissionGuard("employee:read"))],
    summary="List Employees",
)
async def list_employees(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    department: str | None = Query(default=None),
    employment_type: str | None = Query(default=None),
    employment_status: str | None = Query(default=None),
    organization_unit: str | None = Query(default=None),
    joining_date: date | None = Query(default=None),
    manager_id: uuid.UUID | None = Query(default=None),
    sort_by: str | None = Query(default=None),
    sort_order: str = Query(default="asc"),
    current_user: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service),
) -> Any:
    employees, total = await service.employee_repo.get_paginated(
        company_id=current_user.company_id,
        page=page,
        size=size,
        search=search,
        department=department,
        employment_type=employment_type,
        employment_status=employment_status,
        organization_unit=organization_unit,
        joining_date=joining_date,
        manager_id=manager_id,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    # Map to schema pagination metadata
    meta = {
        "page": page,
        "size": size,
        "total_records": total,
    }
    return SuccessResponse(data=employees, meta=meta)


@router.get(
    "/{id}",
    response_model=SuccessResponse[EmployeeFullResponse],
    dependencies=[Depends(PermissionGuard("employee:read"))],
    summary="Get Employee Detail",
)
async def get_employee(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service),
) -> Any:
    employee = await service.employee_repo.get_by_id_with_relations(id)
    if (
        not employee
        or employee.company_id != current_user.company_id
        or employee.deleted_at is not None
    ):
        from app.core.exceptions.base import NotFoundException

        raise NotFoundException("EMPLOYEE_NOT_FOUND", "Employee not found")
    return SuccessResponse(data=employee)


@router.put(
    "/{id}",
    response_model=SuccessResponse[EmployeeFullResponse],
    dependencies=[Depends(PermissionGuard("employee:update"))],
    summary="Update Employee",
)
async def update_employee(
    id: uuid.UUID,
    payload: EmployeeUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service),
) -> Any:
    employee = await service.update_employee(
        company_id=current_user.company_id,
        employee_id=id,
        payload=payload,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=employee)


@router.patch(
    "/{id}/status",
    response_model=SuccessResponse[EmployeeFullResponse],
    dependencies=[Depends(PermissionGuard("employee:update"))],
    summary="Change Employee Status",
)
async def patch_status(
    id: uuid.UUID,
    status_str: str = Query(..., alias="status"),
    current_user: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service),
) -> Any:
    employee = await service.patch_status(
        company_id=current_user.company_id,
        employee_id=id,
        status=status_str,
        actor_id=current_user.id,
    )
    return SuccessResponse(data=employee)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(PermissionGuard("employee:delete"))],
    summary="Delete Employee",
)
async def delete_employee(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service),
) -> None:
    await service.delete_employee(
        company_id=current_user.company_id, employee_id=id, actor_id=current_user.id
    )
    return None


@router.get(
    "/{id}/profile",
    response_model=SuccessResponse[EmployeeProfileResponse],
    dependencies=[Depends(PermissionGuard("employee:read"))],
    summary="Get Employee Biographical Profile",
)
async def get_profile(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: ProfileService = Depends(get_profile_service),
) -> Any:
    profile = await service.get_profile(
        company_id=current_user.company_id, employee_id=id
    )
    return SuccessResponse(data=profile)


@router.put(
    "/{id}/profile",
    response_model=SuccessResponse[EmployeeProfileResponse],
    dependencies=[Depends(PermissionGuard("employee:update"))],
    summary="Update Employee Biographical Profile",
)
async def update_profile(
    id: uuid.UUID,
    payload: EmployeeProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    service: ProfileService = Depends(get_profile_service),
) -> Any:
    profile = await service.update_profile(
        company_id=current_user.company_id,
        employee_id=id,
        bio=payload.bio,
        languages=payload.languages,
        skills=payload.skills,
        profile_photo=payload.profile_photo,
    )
    return SuccessResponse(data=profile)
