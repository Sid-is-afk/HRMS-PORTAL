from pydantic import BaseModel


class ProfileSelfResponse(BaseModel):
    id: str
    employeeId: str
    firstName: str
    lastName: str
    email: str
    phone: str
    avatarUrl: str | None = None
    department: str
    designation: str
    managerName: str
    joiningDate: str
    location: str
    address: str


class ProfileSelfUpdateRequest(BaseModel):
    firstName: str | None = None
    lastName: str | None = None
    phone: str | None = None
    address: str | None = None


class EmploymentDetailsResponse(BaseModel):
    employeeId: str
    department: str
    designation: str
    managerName: str
    joiningDate: str
    employmentStatus: str


class EmergencyContactResponse(BaseModel):
    id: str
    name: str
    relationship: str
    phone: str


class AvatarResponse(BaseModel):
    avatarUrl: str


class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str


class DocumentResponse(BaseModel):
    id: str
    name: str
    type: str
    uploadedAt: str


class AccountInfoResponse(BaseModel):
    email: str
    phone: str
    lastPasswordChange: str
    twoFactorEnabled: bool
