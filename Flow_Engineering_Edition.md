
# Flow.md

> **Document:** System & User Flow Specification
> **Product:** HRMS Portal
> **Version:** 1.0 (Engineering Edition)
> **Status:** Draft

---

# 1. Purpose

This document defines the functional flows, user journeys, backend processing sequences, and state transitions for the HRMS Portal. It bridges the gap between the TRD and UI implementation.

Related documents:

| Document | Purpose |
|-----------|---------|
| PRD.md | Business requirements |
| Architecture.md | System architecture |
| Schema.md | Database model |
| TRD.md | Technical implementation |

---

# 2. High-Level User Journey

```mermaid
flowchart LR
Launch --> Login
Login --> Dashboard
Dashboard --> Attendance
Dashboard --> Leave
Dashboard --> Profile
Dashboard --> EmployeeManagement
```

---

# 3. Authentication Flow

```mermaid
sequenceDiagram
participant User
participant App
participant API
participant DB

User->>App: Enter credentials
App->>API: POST /auth/login
API->>DB: Validate user
DB-->>API: User
API-->>App: JWT + Refresh Token
App-->>User: Dashboard
```

### Alternate Flows
- Invalid credentials
- Locked account
- Inactive employee
- Expired refresh token

---

# 4. Attendance Flow

```mermaid
flowchart TD
Start --> CheckAuthentication
CheckAuthentication --> AlreadyMarked?
AlreadyMarked -- Yes --> Reject
AlreadyMarked -- No --> RecordAttendance
RecordAttendance --> AuditLog
AuditLog --> Success
```

Rules:
- One clock-in per day
- Server timestamp
- Offline requests queued
- Duplicate requests rejected

---

# 5. Leave Request Flow

```mermaid
flowchart LR
Employee --> CreateRequest
CreateRequest --> Validation
Validation --> SaveRequest
SaveRequest --> Pending
Pending --> HRDecision
HRDecision --> Approved
HRDecision --> Rejected
```

State transitions:

PENDING → APPROVED

PENDING → REJECTED

PENDING → CANCELLED

---

# 6. Employee Creation Flow

```mermaid
sequenceDiagram
HR->>API: Create Employee
API->>Service: Validate
Service->>DB: Generate Employee ID
DB-->>Service: Save
Service-->>API: Success
API-->>HR: Employee Created
```

Checks:
- Tenant isolation
- Unique employee ID
- Unique company email

---

# 7. Offline Synchronization

```mermaid
flowchart LR
OfflineAction --> LocalQueue
LocalQueue --> MMKV
NetworkRestored --> SyncEngine
SyncEngine --> API
API --> Database
```

Conflict strategy:
- Server is source of truth
- Ordered replay
- Idempotent requests

---

# 8. RBAC Decision Flow

```mermaid
flowchart TD
Request --> Authenticated?
Authenticated? -- No --> Unauthorized
Authenticated? -- Yes --> TenantCheck
TenantCheck --> RoleCheck
RoleCheck --> PermissionCheck
PermissionCheck --> Execute
```

---

# 9. Error Flow

```mermaid
flowchart LR
Request --> Validation
Validation -- Fail --> ErrorResponse
Validation -- Pass --> Processing
Processing -- Exception --> ErrorHandler
ErrorHandler --> StructuredResponse
```

All responses include a correlation ID.

---

# 10. Screen Navigation Matrix

| Screen | Next Screens |
|---------|--------------|
| Splash | Login, Dashboard |
| Login | Dashboard, Forgot Password |
| Dashboard | Attendance, Leave, Profile, Employees |
| Attendance | Dashboard |
| Leave | Dashboard |
| Profile | Dashboard |

---

# 11. API Interaction Pattern

```mermaid
sequenceDiagram
App->>API: Request
API->>Service: Business Logic
Service->>Repository: Persistence
Repository->>DB: Query
DB-->>Repository: Result
Repository-->>Service: Entity
Service-->>API: DTO
API-->>App: JSON
```

---

# 12. State Models

## Attendance

NOT_MARKED → CLOCKED_IN → CLOCKED_OUT

## Leave

PENDING → APPROVED

PENDING → REJECTED

PENDING → CANCELLED

## Employee

ACTIVE → INACTIVE

---

# 13. Future Flows

Reserved for:
- Notifications
- Payroll
- Shift scheduling
- Performance reviews
- Document approval
- Web portal synchronization

---

# 14. Traceability

| Flow | PRD Module | TRD Module |
|------|------------|------------|
| Login | Authentication | auth |
| Attendance | Attendance | attendance |
| Leave | Leave | leave |
| Employee | Employee | employee |

---

# End of Flow.md
