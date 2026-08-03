from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies.auth import get_current_user
from app.database.connection import get_db
from app.modules.auth.domains.users.models.user import User
from app.modules.employee.domains.profile.models.employee import Employee
from app.modules.employee.domains.profile.schemas.profile_self import (
    AccountInfoResponse,
    AvatarResponse,
    ChangePasswordRequest,
    DocumentResponse,
    EmergencyContactResponse,
    EmploymentDetailsResponse,
    ProfileSelfResponse,
    ProfileSelfUpdateRequest,
)
from app.shared.responses.standard import SuccessResponse

router = APIRouter(prefix="/profile", tags=["Self Profile"])


async def get_current_employee(current_user: User, db: AsyncSession) -> Employee | None:
    try:
        stmt = select(Employee).where(Employee.identity_id == current_user.identity_id)
        result = await db.execute(stmt)
        return result.scalars().first()
    except Exception:
        return None


@router.get("", response_model=SuccessResponse[ProfileSelfResponse])
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    emp = await get_current_employee(current_user, db)

    # Resolve names and fallback defaults
    first_name = emp.first_name if emp else current_user.display_name.split()[0]
    last_name = (
        emp.last_name
        if emp
        else (
            current_user.display_name.split()[1]
            if len(current_user.display_name.split()) > 1
            else ""
        )
    )

    data = ProfileSelfResponse(
        id=str(emp.id) if emp else str(current_user.id),
        employeeId=emp.employee_code if emp else "EMP00001",
        firstName=first_name,
        lastName=last_name,
        email=current_user.identity.email if emp else "aarav.patel@company.com",
        phone=emp.preferred_name or "+91 98765 43210" if emp else "+91 98765 43210",
        avatarUrl=emp.profile_photo if emp else None,
        department=emp.department or "Engineering" if emp else "Engineering",
        designation=(
            emp.designation or "Senior Mobile Engineer"
            if emp
            else "Senior Mobile Engineer"
        ),
        managerName="Mina Rao",
        joiningDate=str(emp.joining_date) if emp else "2023-05-15",
        location=emp.work_location or "Bengaluru" if emp else "Bengaluru",
        address="12, MG Road, Bengaluru",
    )
    return SuccessResponse(data=data)


@router.put("", response_model=SuccessResponse[ProfileSelfResponse])
async def update_profile(
    payload: ProfileSelfUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    emp = await get_current_employee(current_user, db)

    first_name = payload.firstName or (
        emp.first_name if emp else current_user.display_name.split()[0]
    )
    last_name = payload.lastName or (
        emp.last_name
        if emp
        else (
            current_user.display_name.split()[1]
            if len(current_user.display_name.split()) > 1
            else ""
        )
    )

    # Save to db if employee profile exists
    if emp:
        if payload.firstName:
            emp.first_name = payload.firstName
        if payload.lastName:
            emp.last_name = payload.lastName
        db.add(emp)
        await db.commit()

    data = ProfileSelfResponse(
        id=str(emp.id) if emp else str(current_user.id),
        employeeId=emp.employee_code if emp else "EMP00001",
        firstName=first_name,
        lastName=last_name,
        email=current_user.identity.email if emp else "aarav.patel@company.com",
        phone=payload.phone or "+91 98765 43210",
        avatarUrl=emp.profile_photo if emp else None,
        department=emp.department or "Engineering" if emp else "Engineering",
        designation=(
            emp.designation or "Senior Mobile Engineer"
            if emp
            else "Senior Mobile Engineer"
        ),
        managerName="Mina Rao",
        joiningDate=str(emp.joining_date) if emp else "2023-05-15",
        location=emp.work_location or "Bengaluru" if emp else "Bengaluru",
        address=payload.address or "12, MG Road, Bengaluru",
    )
    return SuccessResponse(data=data)


@router.get("/employment", response_model=SuccessResponse[EmploymentDetailsResponse])
async def get_employment_details(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    emp = await get_current_employee(current_user, db)
    data = EmploymentDetailsResponse(
        employeeId=emp.employee_code if emp else "EMP00001",
        department=emp.department or "Engineering" if emp else "Engineering",
        designation=(
            emp.designation or "Senior Mobile Engineer"
            if emp
            else "Senior Mobile Engineer"
        ),
        managerName="Mina Rao",
        joiningDate=str(emp.joining_date) if emp else "2023-05-15",
        employmentStatus=emp.employment_status if emp else "ACTIVE",
    )
    return SuccessResponse(data=data)


@router.get(
    "/emergency-contacts",
    response_model=SuccessResponse[list[EmergencyContactResponse]],
)
async def get_emergency_contacts(
    current_user: User = Depends(get_current_user),
) -> Any:
    contacts = [
        EmergencyContactResponse(
            id="emg-1",
            name="Asha Patel",
            relationship="Mother",
            phone="+91 99887 66554",
        )
    ]
    return SuccessResponse(data=contacts)


@router.put(
    "/emergency-contacts",
    response_model=SuccessResponse[list[EmergencyContactResponse]],
)
async def update_emergency_contacts(
    payload: EmergencyContactResponse,
    current_user: User = Depends(get_current_user),
) -> Any:
    return SuccessResponse(data=[payload])


@router.post("/avatar", response_model=SuccessResponse[AvatarResponse])
async def upload_avatar(
    current_user: User = Depends(get_current_user),
) -> Any:
    return SuccessResponse(
        data=AvatarResponse(avatarUrl="https://avatar.iran.liara.run/public/1")
    )


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
) -> None:
    # Just succeed in development
    return None


@router.get("/documents", response_model=SuccessResponse[list[DocumentResponse]])
async def get_documents(
    current_user: User = Depends(get_current_user),
) -> Any:
    docs = [
        DocumentResponse(
            id="doc-1", name="Offer Letter", type="offer", uploadedAt="2023-05-01"
        ),
        DocumentResponse(
            id="doc-2", name="ID Proof", type="id", uploadedAt="2023-05-02"
        ),
    ]
    return SuccessResponse(data=docs)


@router.get("/account", response_model=SuccessResponse[AccountInfoResponse])
async def get_account_info(
    current_user: User = Depends(get_current_user),
) -> Any:
    data = AccountInfoResponse(
        email=(
            current_user.identity.email if current_user else "aarav.patel@company.com"
        ),
        phone="+91 98765 43210",
        lastPasswordChange="2026-06-01",
        twoFactorEnabled=False,
    )
    return SuccessResponse(data=data)
