import re
import uuid
from datetime import date, datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)


class ContactInformationBase(BaseModel):
    primary_email: EmailStr
    secondary_email: EmailStr | None = None
    primary_phone: str = Field(..., min_length=7, max_length=20)
    secondary_phone: str | None = Field(None, min_length=7, max_length=20)
    current_address: str | None = Field(None, max_length=500)
    permanent_address: str | None = Field(None, max_length=500)

    @field_validator("primary_phone", "secondary_phone")
    @classmethod
    def validate_phone(cls, v: str | None) -> str | None:
        if v is None:
            return v
        # Basic validation: digits, optional +, -, spaces
        cleaned = re.sub(r"[\s\-\(\)\+]", "", v)
        if not cleaned.isdigit() or len(cleaned) < 7 or len(cleaned) > 15:
            raise ValueError("Phone number must contain between 7 and 15 digits")
        return v


class ContactInformationCreate(ContactInformationBase):
    pass


class ContactInformationUpdate(ContactInformationBase):
    primary_email: EmailStr | None = None  # type: ignore[assignment]
    primary_phone: str | None = Field(None, min_length=7, max_length=20)  # type: ignore[assignment]


class ContactInformationResponse(ContactInformationBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    employee_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class EmploymentBase(BaseModel):
    employment_status: str = "ACTIVE"
    employment_type: str | None = None
    reporting_manager_id: uuid.UUID | None = None
    department: str | None = None
    designation: str | None = None
    business_unit: str | None = None
    organization_unit: str | None = None
    joining_date: date
    confirmation_date: date | None = None
    exit_date: date | None = None


class EmploymentCreate(EmploymentBase):
    pass


class EmploymentUpdate(EmploymentBase):
    joining_date: date | None = None  # type: ignore[assignment]


class EmploymentResponse(EmploymentBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    employee_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class EmergencyContactBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    relationship: str = Field(..., min_length=2, max_length=50)
    phone: str = Field(..., min_length=7, max_length=20)
    email: EmailStr | None = None
    priority: int = Field(default=1, ge=1)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-\(\)\+]", "", v)
        if not cleaned.isdigit() or len(cleaned) < 7 or len(cleaned) > 15:
            raise ValueError("Emergency contact phone number must contain 7-15 digits")
        return v


class EmergencyContactCreate(EmergencyContactBase):
    pass


class EmergencyContactUpdate(EmergencyContactBase):
    name: str | None = Field(None, min_length=2, max_length=100)  # type: ignore[assignment]
    relationship: str | None = Field(None, min_length=2, max_length=50)  # type: ignore[assignment]
    phone: str | None = Field(None, min_length=7, max_length=20)  # type: ignore[assignment]


class EmergencyContactResponse(EmergencyContactBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    employee_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class BankInformationBase(BaseModel):
    bank_name: str = Field(..., min_length=2, max_length=100)
    account_holder: str = Field(..., min_length=2, max_length=150)
    account_number: str = Field(..., min_length=5, max_length=50)
    ifsc: str = Field(..., min_length=11, max_length=11)
    branch: str = Field(..., min_length=2, max_length=100)
    primary_account: bool = False

    @field_validator("ifsc")
    @classmethod
    def validate_ifsc(cls, v: str) -> str:
        # Standard Indian IFSC code validation: 4 alphabets, 0, 6 characters
        ifsc_regex = r"^[A-Z]{4}0[A-Z0-9]{6}$"
        if not re.match(ifsc_regex, v.upper()):
            raise ValueError("Invalid IFSC format. Must match ^[A-Z]{4}0[A-Z0-9]{6}$")
        return v.upper()

    @field_validator("account_number")
    @classmethod
    def validate_account_number(cls, v: str) -> str:
        if not v.isdigit():
            raise ValueError("Bank account number must contain digits only")
        return v


class BankInformationCreate(BankInformationBase):
    pass


class BankInformationUpdate(BankInformationBase):
    bank_name: str | None = Field(None, min_length=2, max_length=100)  # type: ignore[assignment]
    account_holder: str | None = Field(None, min_length=2, max_length=150)  # type: ignore[assignment]
    account_number: str | None = Field(None, min_length=5, max_length=50)  # type: ignore[assignment]
    ifsc: str | None = Field(None, min_length=11, max_length=11)  # type: ignore[assignment]
    branch: str | None = Field(None, min_length=2, max_length=100)  # type: ignore[assignment]


class BankInformationResponse(BankInformationBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    employee_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class EmployeeDocumentBase(BaseModel):
    document_type: str = Field(..., min_length=2, max_length=50)
    name: str = Field(..., min_length=2, max_length=150)
    storage_reference: str = Field(..., min_length=2, max_length=255)
    verification_status: str = "PENDING"


class EmployeeDocumentCreate(EmployeeDocumentBase):
    pass


class EmployeeDocumentUpdate(EmployeeDocumentBase):
    document_type: str | None = Field(None, min_length=2, max_length=50)  # type: ignore[assignment]
    name: str | None = Field(None, min_length=2, max_length=150)  # type: ignore[assignment]
    storage_reference: str | None = Field(None, min_length=2, max_length=255)  # type: ignore[assignment]


class EmployeeDocumentResponse(EmployeeDocumentBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    employee_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class EmployeeCreateRequest(BaseModel):
    identity_id: uuid.UUID | None = None
    employee_code: str = Field(..., min_length=2, max_length=20)
    first_name: str = Field(..., min_length=1, max_length=80)
    middle_name: str | None = Field(None, max_length=80)
    last_name: str = Field(..., min_length=1, max_length=80)
    preferred_name: str | None = Field(None, max_length=80)
    gender: str | None = Field(None, max_length=20)
    date_of_birth: date | None = None
    nationality: str | None = Field(None, max_length=50)
    profile_photo: str | None = Field(None, max_length=255)
    employment_status: str = "ACTIVE"
    employment_type: str | None = Field(None, max_length=50)
    department: str | None = Field(None, max_length=100)
    designation: str | None = Field(None, max_length=100)
    manager_id: uuid.UUID | None = None
    joining_date: date
    confirmation_date: date | None = None
    work_location: str | None = Field(None, max_length=100)
    organization_unit: str | None = Field(None, max_length=100)

    # Nested components managed by the aggregate root
    contact_info: ContactInformationCreate | None = None
    employment: EmploymentCreate | None = None
    emergency_contacts: list[EmergencyContactCreate] | None = None
    bank_info: list[BankInformationCreate] | None = None
    documents: list[EmployeeDocumentCreate] | None = None

    @model_validator(mode="after")
    def validate_dates(self) -> "EmployeeCreateRequest":
        if self.joining_date and self.confirmation_date:
            if self.joining_date > self.confirmation_date:
                raise ValueError("Joining date must be on or before confirmation date")
        return self


class EmployeeUpdateRequest(BaseModel):
    first_name: str | None = Field(None, min_length=1, max_length=80)
    middle_name: str | None = Field(None, max_length=80)
    last_name: str | None = Field(None, min_length=1, max_length=80)
    preferred_name: str | None = Field(None, max_length=80)
    gender: str | None = Field(None, max_length=20)
    date_of_birth: date | None = None
    nationality: str | None = Field(None, max_length=50)
    profile_photo: str | None = Field(None, max_length=255)
    employment_status: str | None = Field(None, max_length=50)
    employment_type: str | None = Field(None, max_length=50)
    department: str | None = Field(None, max_length=100)
    designation: str | None = Field(None, max_length=100)
    manager_id: uuid.UUID | None = None
    joining_date: date | None = None
    confirmation_date: date | None = None
    work_location: str | None = Field(None, max_length=100)
    organization_unit: str | None = Field(None, max_length=100)

    # Nested updates
    contact_info: ContactInformationUpdate | None = None
    employment: EmploymentUpdate | None = None
    emergency_contacts: list[EmergencyContactCreate] | None = None
    bank_info: list[BankInformationCreate] | None = None
    documents: list[EmployeeDocumentCreate] | None = None

    @model_validator(mode="after")
    def validate_dates(self) -> "EmployeeUpdateRequest":
        jd = self.joining_date
        cd = self.confirmation_date
        if jd and cd and jd > cd:
            raise ValueError("Joining date must be on or before confirmation date")
        return self


class EmployeeSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    company_id: uuid.UUID
    employee_code: str
    first_name: str
    last_name: str
    preferred_name: str | None
    employment_status: str
    employment_type: str | None
    department: str | None
    designation: str | None
    joining_date: date


class EmployeeFullResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    company_id: uuid.UUID
    identity_id: uuid.UUID | None
    employee_code: str
    first_name: str
    middle_name: str | None
    last_name: str
    preferred_name: str | None
    gender: str | None
    date_of_birth: date | None
    nationality: str | None
    profile_photo: str | None
    employment_status: str
    employment_type: str | None
    department: str | None
    designation: str | None
    manager_id: uuid.UUID | None
    joining_date: date
    confirmation_date: date | None
    work_location: str | None
    organization_unit: str | None
    created_at: datetime
    updated_at: datetime

    # Nested components
    contact_info: ContactInformationResponse | None = None
    employment: EmploymentResponse | None = None
    emergency_contacts: list[EmergencyContactResponse] = []
    bank_info: list[BankInformationResponse] = []
    documents: list[EmployeeDocumentResponse] = []


class EmployeeProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    employee_code: str
    first_name: str
    last_name: str
    profile_photo: str | None
    department: str | None
    designation: str | None
    joining_date: date
    bio: str | None = None
    languages: list[str] = []
    skills: list[str] = []


class EmployeeProfileUpdateRequest(BaseModel):
    profile_photo: str | None = Field(None, max_length=255)
    bio: str | None = Field(None, max_length=1000)
    languages: list[str] | None = None
    skills: list[str] | None = None
