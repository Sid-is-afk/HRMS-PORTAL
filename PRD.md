# Product Requirements Document

**Project:** HRMS Portal

**Version:** 1.0 (Draft)

**Status:** In Progress

**Document Owner:** Product Team

**Architecture:** Enterprise Modular Monolith (Microservice Ready)

**Target Platform:** Mobile (React Native)

**Last Updated:** July 2026

## Document Control

| Field | Value |
|---|---|
| Project Name | HRMS Portal |
| Product Type | Human Resource Management System |
| Platform | Mobile Application |
| Primary Users | Employees, Managers, HR Admins, Super Admins |
| Frontend | React Native (JSX) |
| Backend | FastAPI (Python) |
| Package Manager | uv |
| Database | PostgreSQL |
| Architecture | Modular Monolith (Future Microservice Compatible) |
| Authentication | JWT + Refresh Tokens |
| Deployment (MVP) | Free Tier Cloud Services |
| Scalability Goal | 100,000+ Employees |
| Multi Tenant | Yes |
| Offline Support | Yes |

## Version History

| Version | Date | Author | Description |
|---|---|---|---|
| 0.1 | July 2026 | Product Team | Initial Product Requirements Draft |
| 1.0 | TBD | Product Team | Approved MVP Requirements |

## Table of Contents

1. Executive Summary
2. Product Vision
3. Problem Statement
4. Product Goals
5. Success Metrics
6. Stakeholders
7. Product Scope
8. Out of Scope
9. Product Principles
10. Product Users
11. User Personas
12. User Goals
13. User Journey
14. Company Hierarchy
15. Business Rules
16. User Stories
17. Functional Requirements
18. Non-Functional Requirements
19. Performance Requirements
20. Scalability Requirements
21. Security Requirements
22. Reliability Requirements
23. Availability Requirements
24. Data Integrity Requirements
25. Maintainability Requirements
26. Observability Requirements
27. Accessibility Requirements
28. Usability Requirements
29. Compatibility Requirements
30. Deployment Requirements
31. Backup & Recovery Requirements
32. Compliance & Privacy Considerations
33. Operational Readiness
34. Quality Attributes Summary
35. Role-Based Access Control (RBAC)
36. Acceptance Criteria
37. Product Risks
38. Product Assumptions
39. Product Constraints
40. Product Dependencies
41. MVP Release Checklist
42. MVP Success KPIs
43. Product Roadmap
44. Long-Term Product Vision
45. Requirement Traceability Matrix
46. Glossary
47. Product Approval & Sign-off
48. Conclusion

---

## 1. Executive Summary

HRMS Portal is a modern, scalable, mobile-first Human Resource Management System (HRMS) designed to simplify employee management for organizations of all sizes. The initial release focuses on delivering a streamlined Minimum Viable Product (MVP) that enables organizations to manage attendance, employee information, and leave requests through a single mobile application while supporting role-based access for Employees, Managers, HR Admins, and Super Admins.

Unlike traditional HRMS solutions that often become difficult to extend, HRMS Portal is designed with long-term scalability in mind. Although the MVP will be deployed using free-tier cloud infrastructure to minimize development costs, the underlying architecture will be modular, cloud-agnostic, and capable of scaling to support organizations with over 100,000 employees without requiring significant changes to the application codebase.

The system follows a modular monolithic architecture with clearly defined boundaries between domains, allowing a gradual transition toward a microservices architecture in the future if business requirements demand it.

The primary objective of the MVP is to establish a secure, reliable, and maintainable foundation upon which future modules—such as payroll, recruitment, performance management, document management, notifications, analytics, and shift scheduling—can be integrated seamlessly.

## 2. Product Vision

To build a modern, scalable, mobile-first HRMS platform that simplifies workforce management for organizations while maintaining enterprise-grade architecture, security, and extensibility from day one.

HRMS Portal aims to become more than an attendance application. It is envisioned as a complete Human Capital Management (HCM) ecosystem capable of supporting organizations ranging from small startups to large enterprises.

The product will prioritize:

- Simplicity for end users
- Reliability for HR teams
- Maintainability for developers
- Scalability for growing organizations
- Security for enterprise customers

Every architectural decision made during MVP development should contribute toward these long-term goals.

## 3. Problem Statement

Many small and medium-sized organizations continue to rely on spreadsheets, paper-based processes, or disconnected software systems for managing employee attendance, leave requests, and employee records. These approaches introduce inefficiencies, increase administrative overhead, and make it difficult to maintain accurate and centralized workforce information.

Common challenges include:

- Manual attendance tracking prone to errors
- Lack of centralized employee information
- Delayed leave approval processes
- Limited visibility into workforce status
- Difficulty maintaining historical records
- Inconsistent employee data across departments
- Absence of role-based access control
- Systems that cannot scale as organizations grow

Existing enterprise HRMS platforms often provide extensive functionality but are costly, complex, and difficult for smaller organizations to adopt.

HRMS Portal addresses these challenges by providing a focused, intuitive, and scalable solution that balances ease of use with enterprise-level architectural quality.

## 4. Product Goals

### Primary Goals

**G-001 — Centralize Employee Management**

Provide a single source of truth for employee information, attendance records, and leave requests.

**G-002 — Simplify Attendance**

Allow employees to record attendance quickly while enabling administrators to monitor workforce activity in real time.

**G-003 — Streamline Leave Management**

Replace manual leave approval workflows with a structured approval system.

**G-004 — Secure Role-Based Access**

Ensure every user can access only the information and functionality appropriate to their organizational role.

**G-005 — Enable Future Expansion**

Design the application so additional HR modules can be introduced without major architectural changes.

**G-006 — Support Multi-Tenant Organizations**

Allow multiple companies to use the platform independently while ensuring complete data isolation.

**G-007 — Build Once, Scale Later**

Although the MVP will use free-tier cloud infrastructure, the application's architecture should support migration to enterprise infrastructure with minimal code modifications.

## 5. Success Metrics

The success of the MVP will be measured using both technical and business metrics.

### Product Metrics

| Metric | Target |
|---|---|
| Employee Login Success Rate | >99% |
| Attendance Submission Success | >99% |
| Leave Request Processing | <5 seconds |
| Employee Profile Load Time | <2 seconds |
| Dashboard Load Time | <2 seconds |

### Technical Metrics

| Metric | Target |
|---|---|
| API Availability | 99.9% |
| Crash-Free Sessions | >99% |
| Database Query Time | <200 ms |
| Authentication Response | <500 ms |
| API Error Rate | <1% |

### Business Metrics

- Reduced attendance processing time
- Reduced manual HR workload
- Increased employee adoption
- Faster leave approvals
- Accurate attendance reporting
- Centralized employee records

## 6. Stakeholders

### Internal Stakeholders

**Product Owner**

Responsible for product vision, prioritization, and roadmap.

**Development Team**

Responsible for implementation, testing, deployment, and maintenance.

**UI/UX Designers**

Responsible for user experience, interaction design, accessibility, and design consistency.

**QA Team**

Responsible for validation, regression testing, and release quality.

### External Stakeholders

**Employees**

Primary users who interact with attendance, leave, and profile features.

**Managers**

Responsible for monitoring their reporting teams and approving requests where applicable.

**HR Administrators**

Responsible for employee management, attendance correction, and leave administration.

**Super Administrators**

Responsible for organization-level configuration, administrative oversight, and tenant management.

## 7. Product Scope (MVP)

The MVP includes the following core capabilities:

**Authentication**
- Email and Password Login
- Phone Number and Password Login
- Secure JWT Authentication
- Refresh Token Support
- Forgot Password
- OTP Verification
- Persistent Login Sessions

**Employee Module**
- View Profile
- View Department
- View Designation
- View Reporting Manager
- View Employment Status
- Profile Photo
- Logout

**Attendance Module**
- Clock In
- Clock Out
- Attendance History
- Working Status
- Minimum Working Duration Validation
- Attendance Correction by Admin
- Attendance Audit Logs

**Leave Module**
- Apply Leave
- Half-Day Leave
- Leave Balance
- Leave Cancellation
- Leave Approval Workflow
- Leave History
- Leave Status Tracking

**Admin Module**
- Dashboard
- Employee Directory
- Employee Creation
- Employee Deactivation
- Attendance Monitoring
- Attendance Correction
- Leave Management
- Basic Reports

**Multi-Tenant Foundation**
- Company Isolation
- Branch Support
- Department Support
- Role-Based Access Control

**Offline Support**
- Cached Employee Data
- Cached Dashboard
- Offline Queue
- Automatic Synchronization
- Retry Mechanism

## 8. Out of Scope (Phase 2+)

The following features are intentionally excluded from the MVP to ensure timely delivery while maintaining architectural readiness for future implementation:

- Payroll Management
- Payslip Generation
- Push Notifications
- GPS Attendance Validation
- Geofencing
- Face Recognition
- Biometric Attendance
- Recruitment
- Performance Reviews
- Asset Management
- Employee Documents
- Expense Management
- Shift Scheduling
- Calendar Management
- Chat Module
- Video Meetings
- Advanced Analytics
- AI-Based Insights
- Public APIs
- Third-Party Integrations (ERP, Accounting, Identity Providers)
- Multi-language Support
- Web Application

Each of these modules will be considered during subsequent product phases and will leverage the scalable architecture established during the MVP.

## 9. Product Principles

The following principles guide every product and engineering decision:

**Mobile-First Experience**
The primary interface is a responsive and intuitive mobile application optimized for everyday employee and administrative tasks.

**Security by Default**
Security is integrated into every layer of the system, including authentication, authorization, data storage, and API communication.

**Scalability from Day One**
Architectural decisions prioritize long-term growth, even when deployed on cost-effective infrastructure during the MVP.

**Modular Design**
Features are developed as isolated modules to simplify maintenance, testing, and future expansion.

**Offline Resilience**
Core user workflows remain functional during temporary network interruptions through local caching and queued synchronization.

**Enterprise Readiness**
The platform is designed to accommodate large organizations, multiple tenants, configurable business rules, and future integrations without fundamental redesign.

**Developer Experience**
Clear documentation, consistent coding standards, and maintainable architecture are essential to support long-term development and onboarding.

---

## 10. Product Users

HRMS Portal is designed around Role-Based Access Control (RBAC). Every authenticated user belongs to a Company (Tenant) and is assigned one or more roles that determine the actions they can perform.

The MVP introduces four primary roles:

```
HRMS Portal
│
├── Employee
│
├── Manager
│
├── HR Admin
│
└── Super Admin
```

The RBAC system is intentionally designed to support additional roles (Finance, Recruiter, Payroll Admin, IT Admin, etc.) in future releases without requiring architectural changes.

## 11. User Personas

### 11.1 Employee

**Description**

An employee is the primary end-user of the application. Employees interact with the system daily to manage attendance, submit leave requests, and view their personal information.

**Goals**
- Mark attendance quickly
- View attendance history
- Apply for leave
- Track leave status
- View leave balance
- Access profile information
- Stay logged in securely
- Use the application with minimal learning curve

**Pain Points**
- Manual attendance systems
- Delayed leave approvals
- No visibility into leave balance
- Multiple HR portals
- Complex interfaces

**Technical Experience**

Low to Medium

The application should require minimal training.

### 11.2 Manager

**Description**

Managers oversee one or more employees within their department or reporting hierarchy.

Managers primarily need visibility rather than administrative control.

**Responsibilities**
- Monitor team attendance
- Review team leave requests
- View reporting employees
- Track employee availability

Future versions may allow managers to approve leave requests directly.

### 11.3 HR Administrator

**Description**

HR Administrators manage the operational aspects of employee records, attendance, and leave.

They act as organizational administrators without having unrestricted system privileges.

**Responsibilities**
- Create employees
- Deactivate employees
- Correct attendance
- Approve leave
- Maintain employee information
- View HR dashboard

### 11.4 Super Administrator

**Description**

The Super Administrator has the highest level of authority within a tenant (company).

This role manages organizational configuration rather than day-to-day HR operations.

**Responsibilities**
- Configure company
- Manage branches
- Manage departments
- Create HR Admins
- Configure attendance rules
- Configure leave policies
- Manage system settings
- Manage user roles

## 12. User Goals

| User | Primary Goal |
|---|---|
| Employee | Daily attendance & leave |
| Manager | Team visibility |
| HR Admin | Employee operations |
| Super Admin | Organization management |

## 13. User Journey

### Employee Journey

```
Open App
      │
      ▼
Authentication
      │
      ▼
Dashboard
      │
      ├──────── Clock In
      │
      ├──────── Leave
      │
      ├──────── Attendance History
      │
      ├──────── Leave Balance
      │
      ├──────── Profile
      │
      └──────── Logout
```

**Expected Experience**

The employee should complete their daily attendance within 5 seconds after opening the application.

No unnecessary navigation should be required.

### HR Admin Journey

```
Login
    │
    ▼
Dashboard
    │
    ├──────── Employees
    │           │
    │           ├── Create
    │           ├── Edit
    │           └── Deactivate
    │
    ├──────── Attendance
    │           │
    │           ├── View
    │           ├── Filter
    │           └── Correct
    │
    ├──────── Leave
    │           │
    │           ├── Pending
    │           ├── Approve
    │           └── Reject
    │
    └──────── Reports
```

### Super Admin Journey

```
Login
     │
     ▼
Dashboard
     │
     ├──────── Company
     │
     ├──────── Branches
     │
     ├──────── Departments
     │
     ├──────── Attendance Policies
     │
     ├──────── Leave Policies
     │
     ├──────── User Roles
     │
     └──────── Settings
```

## 14. Company Hierarchy

HRMS Portal is designed as a multi-tenant enterprise application.

Every organization is logically isolated.

The hierarchy is as follows:

```
Platform
│
├── Company (Tenant)
│      │
│      ├── Branch
│      │      │
│      │      ├── Department
│      │      │      │
│      │      │      ├── Employees
│      │      │      ├── Managers
│      │      │      └── HR Admins
│      │      │
│      │      └── Attendance Rules
│      │
│      └── Company Settings
│
└── Another Company
```

This hierarchy enables:

- Multiple office locations
- Independent attendance policies
- Department-specific management
- Company-level data isolation
- Future regional expansion

## 15. Business Rules

The following business rules define the expected behavior of the application.

### Authentication Rules

**BR-001**

Only HR Admins or Super Admins can create employee accounts.

**BR-002**

Public registration is not permitted.

**BR-003**

Authentication supports:
- Email + Password
- Phone + Password

**BR-004**

Every authenticated session receives:
- Access Token
- Refresh Token

**BR-005**

Access Tokens expire automatically.

Refresh Tokens generate new Access Tokens without requiring the user to log in again.

**BR-006**

Passwords are never stored in plain text.

### Employee Rules

**BR-007**

Every employee belongs to exactly one company.

**BR-008**

Every employee belongs to one branch.

**BR-009**

Every employee belongs to one department.

**BR-010**

Every employee has one reporting manager.

**BR-011**

Employee IDs are unique only within a company.

Example:
- Company A → EMP00001
- Company B → EMP00001

Both are valid.

**BR-012**

UUIDs are used internally for all database relationships.

Employee IDs are business identifiers.

### Attendance Rules

**BR-013**

Employees can Clock In only once per working day.

**BR-014**

Employees can Clock Out only after Clock In.

**BR-015**

Attendance timestamps always use server time, never device time.

This prevents manipulation.

**BR-016**

Attendance cannot be edited by employees.

**BR-017**

Attendance corrections are logged.

Every correction stores:
- Previous value
- Updated value
- Admin
- Timestamp
- Reason

**BR-018**

Minimum working duration is configurable by each company.

Example:
- Company A → 8 Hours
- Company B → 9 Hours

**BR-019**

Attendance rules are configurable.

Future examples:
- Flexible timing
- Shift-based attendance
- Weekend policies
- Night shifts

### Leave Rules

**BR-020**

Leave requests require:
- Start Date
- End Date
- Leave Type
- Reason

**BR-021**

Employees may cancel only Pending leave requests.

**BR-022**

Approved leave cannot be modified.

**BR-023**

Rejected leave cannot be modified.

**BR-024**

Half-day leave is supported.

**BR-025**

Leave balance updates automatically after approval.

**BR-026**

Leave policies are configurable per company.

### Company Rules

**BR-027**

Each company is completely isolated.

Employees cannot access data belonging to another company.

**BR-028**

Every API request validates Tenant Context before processing.

**BR-029**

Database queries are automatically scoped to the authenticated company.

### Offline Rules

**BR-030**

Cached information is marked with the last synchronization timestamp.

**BR-031**

Attendance actions performed while offline are queued locally and submitted when connectivity is restored, subject to server-side validation.

**BR-032**

The server remains the source of truth for attendance, leave, and employee data.

## 16. User Stories

Each user story is uniquely identified for traceability throughout design, development, and testing.

### Authentication

**US-001**

As an Employee, I want to log in using my email and password so that I can securely access my account.

Priority: High

Acceptance Criteria:
- Valid credentials allow access.
- Invalid credentials show an appropriate error.
- Session is created successfully.

**US-002**

As an Employee, I want to remain logged in after closing the app so that I don't have to sign in every day.

Priority: High

**US-003**

As an Employee, I want to reset my password using OTP so that I can recover access if I forget it.

### Attendance

**US-004**

As an Employee, I want to clock in with a single tap so that recording attendance is quick.

**US-005**

As an Employee, I want to clock out at the end of my workday so that my working hours are accurately recorded.

**US-006**

As an HR Admin, I want to correct attendance records so that genuine attendance mistakes can be resolved.

### Leave

**US-007**

As an Employee, I want to submit a leave request so that HR can review and approve it.

**US-008**

As an Employee, I want to track the status of my leave requests so that I know whether they are pending, approved, or rejected.

**US-009**

As an HR Admin, I want to approve or reject leave requests so that leave records remain accurate and employees receive timely decisions.

### Employee Management

**US-010**

As an HR Admin, I want to create new employee accounts so that new hires can access the platform.

**US-011**

As an HR Admin, I want to deactivate employee accounts so that former employees can no longer access the system while preserving historical records.

### Super Administration

**US-012**

As a Super Admin, I want to configure company-specific attendance and leave policies so that each organization can enforce its own business rules without affecting other tenants.

**Traceability Note**

Every user story defined in this section will be mapped to:
- Functional requirements (Part 3 / Section 17)
- API endpoints (TRD.md)
- Database entities (Schema.md)
- Navigation and interaction flows (Flow.md)
- Acceptance tests (later sections of the PRD)

This traceability ensures that every implemented feature can be linked back to a validated business requirement, reducing ambiguity during development and testing.

---

## 17. Functional Requirements

This section defines the functional behavior of every module included in the MVP. Each requirement is uniquely identified to ensure traceability across design, development, testing, API specifications, and database schema.

### Requirement Priority Definitions

| Priority | Description |
|---|---|
| Critical (P0) | Mandatory for MVP release. Application cannot function correctly without it. |
| High (P1) | Essential functionality required for a complete MVP. |
| Medium (P2) | Valuable feature that can be completed after critical workflows. |
| Low (P3) | Nice-to-have enhancement. Can be postponed without affecting core functionality. |

### Module 1 — Authentication & Authorization

**Module Overview**

Authentication is responsible for securely identifying users and establishing authenticated sessions. Authorization determines what resources a user can access based on their assigned role(s).

The authentication system must support both Email and Phone Number based login while implementing secure JWT authentication with Refresh Token rotation.

The system shall follow Zero Trust Principles, meaning every request must be authenticated and authorized independently.

**FR-AUTH-001**

Requirement: The system shall allow users to authenticate using:
- Email + Password
- Phone Number + Password

Priority: P0

Business Value: Allows flexibility while maintaining security.

Acceptance Criteria:
- Valid credentials return Access Token.
- Refresh Token generated.
- Invalid credentials rejected.
- Locked accounts denied access.
- Inactive employees denied access.

Future Scalability: Authentication providers (Google, Microsoft, Azure AD, SAML, OAuth2) can be added without changing authentication architecture.

**FR-AUTH-002**

Requirement: The system shall issue:
- Access Token (Short-lived)
- Refresh Token (Long-lived)

Priority: P0

Business Value: Improves security while reducing login frequency.

Acceptance Criteria:
- Tokens expire correctly.
- Refresh endpoint generates new Access Token.
- Revoked Refresh Tokens cannot be reused.

**FR-AUTH-003**

Requirement: Forgot Password via OTP.

Supported Channels:
- Email OTP
- SMS OTP

Priority: P1

Acceptance Criteria:
- OTP expires.
- OTP is single-use.
- Password reset invalidates previous Refresh Tokens.

**FR-AUTH-004**

Requirement: Persistent login sessions.

Users remain logged in unless:
- Logout
- Password reset
- Account deactivated
- Token revoked

Priority: P1

**FR-AUTH-005**

Requirement: Logout must invalidate Refresh Token.

Priority: P0

**FR-AUTH-006**

Requirement: Passwords shall never be stored in plaintext.

Implementation:
- bcrypt
- Strong password policy
- Rate limiting
- Login throttling

Priority: P0

### Module 2 — Employee Management

**Overview**

Employee Management provides a centralized repository for workforce information.

Every employee belongs to exactly one company.

Every employee has:
- UUID
- Employee ID
- Branch
- Department
- Manager

The Employee ID is a business identifier. The UUID is the system identifier.

**FR-EMP-001**

HR Admins can create employees.

Priority: P0

Fields Required:
- First Name
- Last Name
- Employee ID
- Email
- Phone
- Department
- Branch
- Designation
- Manager
- Joining Date
- Employment Status

Acceptance Criteria:
- Employee created.
- Welcome credentials generated.
- Duplicate Employee IDs within same company rejected.

**FR-EMP-002**

Employee IDs generated automatically.

Format: EMP00001

Rules: Unique per company. Not globally unique.

Priority: P0

**FR-EMP-003**

Employee Profile

Employee can view:
- Profile Picture
- Employee ID
- Department
- Branch
- Designation
- Reporting Manager
- Joining Date
- Contact Details
- Employment Status

Priority: P1

**FR-EMP-004**

HR Admin can edit employee information. Employee cannot.

Priority: P1

**FR-EMP-005**

Soft Delete.

Employees are never permanently deleted. Instead, Status → Inactive.

Historical records remain available.

Priority: P0

Business Value:
- Preserves attendance history.
- Preserves leave history.
- Preserves audit logs.

### Module 3 — Attendance Management

**Overview**

Attendance is one of the most critical modules.

The architecture must support future expansion toward GPS, Face Recognition, Biometrics, and Shift Management without changing attendance data structures.

**Attendance Lifecycle**

```
Employee
   ↓
Clock In
   ↓
Working
   ↓
Break (Future)
   ↓
Clock Out
   ↓
Attendance Complete
```

**FR-ATT-001**

Employee Clock In.

Priority: P0

Rules:
- Once per day
- Server timestamp
- GPS independent (MVP)

Acceptance Criteria: Employee cannot Clock In twice.

**FR-ATT-002**

Employee Clock Out.

Priority: P0

Rules: Clock Out only after Clock In.

**FR-ATT-003**

Working Duration Calculation.

Priority: P0

Formula: Clock Out - Clock In

Future: Subtract Break Duration.

**FR-ATT-004**

Attendance Status. Possible values: Present, Late, Absent, Half Day, On Leave, Holiday, Weekend.

Priority: P1

**FR-ATT-005**

Attendance Correction — Only HR Admin.

Stores: Old Value, New Value, Admin, Timestamp, Reason.

Priority: P1

**FR-ATT-006**

Attendance History. Employees can view: Date, Clock In, Clock Out, Hours Worked, Attendance Status.

Priority: P1

**FR-ATT-007**

Admin Attendance Dashboard. Displays: Today's Attendance, Absent Employees, Late Employees, On Leave.

Priority: P1

### Module 4 — Leave Management

**Overview**

The Leave Module provides complete leave lifecycle management.

Future support: Leave Accrual, Holiday Calendar, Leave Encashment.

**FR-LEAVE-001**

Employee submits leave.

Priority: P0

Fields: Leave Type, Start Date, End Date, Half Day, Reason.

**FR-LEAVE-002**

Leave Types

Default: Casual, Sick, Earned

Future: Configurable.

Priority: P1

**FR-LEAVE-003**

Leave Balance. Employee sees: Available, Used, Remaining.

Priority: P1

**FR-LEAVE-004**

Pending Leave: Employee can cancel.

Approved: Cannot cancel.

Rejected: Cannot edit.

Priority: P1

**FR-LEAVE-005**

Leave Approval. Admin: Approve / Reject.

Priority: P0

Stores: Approver, Timestamp, Comment.

**FR-LEAVE-006**

Leave History. Employee: View all leave requests.

Priority: P1

### Module 5 — Dashboard

Dashboard changes according to role.

**Employee Dashboard**

Displays: Greeting, Attendance Status, Clock In Button, Clock Out Button, Leave Balance, Recent Attendance, Leave Requests.

Priority: P0

**HR Dashboard**

Displays: Employee Count, Present Today, Absent, On Leave, Pending Leave, Today's Attendance.

Priority: P0

**Super Admin Dashboard**

Displays: Company Overview, Branch Statistics, Department Statistics, User Statistics, Attendance Metrics.

Priority: P1

### Module 6 — Profile

**FR-PROFILE-001**

Employee Profile — Read Only.

Priority: P1

**FR-PROFILE-002**

Profile Picture Upload. Allowed: JPG, PNG, WEBP.

Future: Cloud Storage.

Priority: P2

**FR-PROFILE-003**

Password Change. Employee can update password.

Priority: P1

### Module 7 — Role Based Access Control

**Roles:** Employee, Manager, HR Admin, Super Admin

**Permission Model**

Permissions are not hardcoded. Instead:

```
Role
  ↓
Permission
  ↓
Resource
  ↓
Action
```

Future: Additional roles — Finance, Payroll, Recruiter, IT Admin. No database redesign required.

**FR-RBAC-001**

Every API validates Authentication, Authorization, Tenant before execution.

Priority: P0

**FR-RBAC-002**

Permissions evaluated server side.

Priority: P0

### Module 8 — Offline Synchronization

This module is one of the architectural foundations of the application.

Even though the MVP uses free-tier infrastructure, offline synchronization should behave like enterprise applications such as Notion, Slack, or Linear.

**Offline Strategy**

```
Online
  ↓
API
  ↓
Server
  ↓
Database


Offline
  ↓
MMKV
  ↓
Queue
  ↓
Auto Sync
  ↓
API
  ↓
Database
```

**FR-OFFLINE-001**

Employee data cached locally.

Priority: P1

**FR-OFFLINE-002**

Attendance requests queued.

Priority: P1

**FR-OFFLINE-003**

Automatic synchronization.

Priority: P1

Rules: Retry, Backoff, Conflict Resolution.

**FR-OFFLINE-004**

Server remains Source of Truth.

Priority: P0

### Module 9 — Audit Logging

Every enterprise HRMS requires complete traceability.

The system shall maintain immutable audit logs for all critical operations.

Tracked Events include:
- Login
- Logout
- Employee Creation
- Employee Update
- Employee Deactivation
- Attendance Correction
- Leave Approval
- Leave Rejection
- Password Reset
- Role Assignment

Each log entry records:
- User ID
- Company ID
- Action
- Target Entity
- Previous Value (where applicable)
- New Value (where applicable)
- IP Address (future-ready)
- Device Information (future-ready)
- Timestamp

Priority: P1

Business Value:
- Regulatory compliance
- Operational transparency
- Easier debugging
- Accountability

Future Scalability: Designed to support external log aggregation systems (e.g., ELK Stack, Grafana Loki, Datadog) without changes to the application layer.

### Module 10 — Error Handling & User Feedback

The application must provide clear, actionable feedback for both expected and unexpected scenarios.

**FR-ERROR-001**

All API errors shall return a standardized error response format.

Priority: P0

**FR-ERROR-002**

User-facing error messages shall be human-readable and avoid exposing internal system details.

Priority: P0

**FR-ERROR-003**

Network failures shall trigger retry mechanisms where appropriate and provide users with clear status indicators.

Priority: P1

**FR-ERROR-004**

Validation errors shall highlight the specific field(s) requiring correction.

Priority: P1

### Functional Requirement Traceability Summary

| Module | Prefix | Priority |
|---|---|---|
| Authentication | FR-AUTH | P0/P1 |
| Employee Management | FR-EMP | P0/P1 |
| Attendance | FR-ATT | P0/P1 |
| Leave | FR-LEAVE | P0/P1 |
| Dashboard | FR-DASH | P0/P1 |
| Profile | FR-PROFILE | P1/P2 |
| RBAC | FR-RBAC | P0 |
| Offline Sync | FR-OFFLINE | P0/P1 |
| Audit Logging | FR-AUDIT | P1 |
| Error Handling | FR-ERROR | P0/P1 |

### Cross-Document References

The functional requirements defined in this section will directly map to the following project documents:

- **TRD.md** — API design, service architecture, technology choices, and implementation strategy.
- **Schema.md** — Database entities, relationships, constraints, and indexing derived from these requirements.
- **Architecture.md** — Module boundaries, request lifecycle, deployment model, and scalability patterns.
- **Flow.md** — User flows, backend workflows, API sequences, and state transitions for each functional requirement.
- **Design.md** — Screen layouts, component behavior, and UI interactions corresponding to these modules.
- **Plan.md** — Sprint planning, task breakdown, development milestones, and implementation priorities based on the requirement IDs.

---

## 18. Non-Functional Requirements

While functional requirements define what the system should do, non-functional requirements define how well the system should perform.

Since HRMS Portal is being designed as an enterprise-ready SaaS platform from day one, these requirements are considered equally important as the functional requirements.

### NFR Categories

| Category | Objective |
|---|---|
| Performance | Fast response times |
| Scalability | Support future growth |
| Security | Protect user & company data |
| Reliability | Ensure consistent availability |
| Availability | Minimize downtime |
| Maintainability | Simplify future development |
| Observability | Improve monitoring & debugging |
| Usability | Deliver intuitive user experience |
| Accessibility | Inclusive design |
| Portability | Easy cloud migration |
| Extensibility | Support future modules |

## 19. Performance Requirements

**NFR-PERF-001 — API Response Time**

Priority: Critical

Requirement: 95% of all API requests should complete within 500ms under normal operating conditions.

Target:

| Operation | Target |
|---|---|
| Login | <500 ms |
| Dashboard | <1 second |
| Attendance | <500 ms |
| Leave Request | <1 second |
| Employee Search | <700 ms |

**NFR-PERF-002 — Database Query Performance**

Average database queries — Target: Less than 200ms

Heavy reports — Less than 2 seconds

**NFR-PERF-003 — Application Startup**

Cold Start: <4 seconds

Warm Start: <2 seconds

**NFR-PERF-004 — Screen Navigation**

Screen transitions should appear instantaneous.

Target: <300 milliseconds

**NFR-PERF-005 — Offline Cache Loading**

Previously synchronized data should load immediately without requiring network requests.

## 20. Scalability Requirements

The MVP is intentionally developed using free-tier cloud resources.

However, every architectural decision must assume enterprise scale.

### Target Scale

| Metric | Target |
|---|---|
| Companies | 10,000+ |
| Employees | 100,000+ |
| Daily Attendance Records | Millions |
| API Requests | Millions/day |
| Leave Requests | Hundreds of thousands |

**NFR-SCALE-001**

No business logic should depend on the deployment provider.

Changing from Render, Railway, Fly.io to AWS, Azure, GCP must require infrastructure changes only.

**NFR-SCALE-002**

Database design must support horizontal application scaling. Application servers must remain stateless.

**NFR-SCALE-003**

File storage must remain provider independent.

MVP: Local. Future: S3, Azure Blob, Google Cloud Storage — without code rewrite.

**NFR-SCALE-004**

Caching layer should be pluggable.

Current: No Redis required. Future: Redis, Memcached — without changing business logic.

**NFR-SCALE-005**

Architecture must support migration toward microservices without requiring database redesign.

Current: Modular Monolith. Future: Microservices.

## 21. Security Requirements

Security is a first-class architectural concern.

The application follows "Security by Design" rather than "Security as an afterthought."

**Authentication**

Passwords: bcrypt hashing, Salted, Never reversible.

**Session Security**

Access Token: Short-lived

Refresh Token: Rotating, Revocable

**Authorization**

Every request validates Authentication, Role, Tenant, Permission before executing business logic.

**Password Policy**

Minimum: 8 characters

Recommended: Uppercase, Lowercase, Number, Special Character

**OTP**

Single Use, Time Limited. Cannot be reused.

**Rate Limiting**

Login, Forgot Password, OTP Verification, Password Reset must all be rate limited.

**Sensitive Data**

Never exposed: Passwords, Refresh Tokens, Internal IDs, Secrets, Database Credentials.

**HTTPS**

All production communication must use HTTPS. No HTTP.

**NFR-SEC-001**

OWASP Top 10 mitigation shall be considered during implementation.

**NFR-SEC-002**

SQL Injection prevention — ORM, Parameterized queries, Input validation.

**NFR-SEC-003**

XSS protection — Sanitized outputs.

**NFR-SEC-004**

CSRF considerations — Applicable where required.

**NFR-SEC-005**

Security events (Password changes, Role changes, Attendance corrections, Account deactivation) must generate audit logs.

## 22. Reliability Requirements

HRMS Portal should remain dependable even under partial failures.

**NFR-REL-001**

Unexpected application crashes should not corrupt database state.

**NFR-REL-002**

Attendance operations must be atomic. Either the entire operation succeeds or the entire operation fails.

**NFR-REL-003**

Leave approvals must never exist in partially updated states.

**NFR-REL-004**

Offline queue retries automatically. No user intervention.

**NFR-REL-005**

Database transactions shall guarantee consistency.

## 23. Availability Requirements

Target Availability: 99.9%

MVP: Single deployment acceptable.

Production: Load balanced deployment.

**NFR-AVL-001**

Unexpected backend restart should not invalidate all user sessions.

**NFR-AVL-002**

Application should recover automatically after restart.

## 24. Data Integrity Requirements

Employee records, Attendance, Leave, and Audit logs must remain internally consistent.

**NFR-DATA-001**

No orphan records.

**NFR-DATA-002**

Referential integrity enforced.

**NFR-DATA-003**

Soft delete preferred over hard delete.

**NFR-DATA-004**

Historical records remain immutable.

## 25. Maintainability Requirements

Future developers should understand the project quickly.

**Coding Standards**

Consistent naming, consistent architecture, consistent API design.

**Documentation**

Every module documented.

**Modular Design**

Independent features, minimal coupling.

**Testability**

Every service independently testable.

**Dependency Injection**

Preferred throughout backend.

## 26. Observability Requirements

Enterprise software requires visibility.

**Logging**

Application, Authentication, Database, Errors, Performance.

**Monitoring**

Future support: Prometheus, Grafana, Sentry.

**Health Checks**

API, Database. Future: Redis, Storage.

**Error Tracking**

Unhandled exceptions should include: Correlation ID, Timestamp, Stack Trace, Request Context.

## 27. Accessibility Requirements

Accessibility should not be considered an optional enhancement.

The application should conform as closely as practical to WCAG principles for mobile interfaces.

**NFR-ACC-001**

Support scalable text sizes.

**NFR-ACC-002**

Minimum touch target: 44x44 pixels.

**NFR-ACC-003**

Color should never be the sole indicator of information.

**NFR-ACC-004**

High contrast mode supported.

**NFR-ACC-005**

Screen reader compatibility considered.

## 28. Usability Requirements

The application targets employees with varying levels of technical expertise.

Therefore, learning curve should be minimal.

**Design Principles**

Minimal clicks, clear typography, large touch targets, consistent navigation, immediate feedback.

**UX Goals**

Clock In: One tap

Leave Request: Less than 60 seconds

Dashboard: Understandable within 10 seconds

## 29. Compatibility Requirements

**Supported Platforms**

Android — Primary

iOS — Primary

**Backend**

Platform independent.

**Database**

PostgreSQL (Current); Future compatibility with managed PostgreSQL providers.

## 30. Deployment Requirements

Development: Docker Compose

Staging: Cloud

Production: Cloud Native

CI/CD: GitHub Actions

Infrastructure: Infrastructure as Code (Future: Terraform)

## 31. Backup & Recovery Requirements

Employee information is mission-critical.

**Backup Strategy**

Development: Manual

Production: Automated

**Recovery**

Point-in-Time Recovery

Future: Audit Recovery

Audit logs: Never deleted.

## 32. Compliance & Privacy Considerations

Although the MVP is not targeting regulated industries immediately, the platform should be designed with future compliance in mind.

Future readiness includes:
- GDPR-aligned data handling
- Data minimization principles
- User consent mechanisms (where applicable)
- Data retention policies
- Secure deletion workflows
- Export capabilities (Phase 2)

This approach minimizes future refactoring if regulatory requirements evolve.

## 33. Operational Readiness

To ensure the product can transition smoothly from development to production, the following operational capabilities should be supported:

- Environment-specific configuration
- Feature flags (future)
- Centralized logging
- Automated database migrations
- Rollback strategy
- Health endpoints
- Versioned APIs
- Graceful shutdown handling

## 34. Quality Attributes Summary

| Attribute | Target |
|---|---|
| Availability | 99.9% |
| API Response | <500 ms |
| Database Query | <200 ms |
| Startup Time | <4 sec |
| Authentication | JWT + Refresh |
| Offline Support | Yes |
| Multi-Tenant | Yes |
| Horizontal Scaling | Supported |
| Modular Architecture | Yes |
| Provider Agnostic | Yes |
| Audit Logging | Complete |
| Soft Delete | Yes |
| UUID Internal IDs | Yes |
| Company-Specific Employee IDs | Yes |
| Cloud Migration | Minimal Code Changes |

### Enterprise Scalability Considerations

Every non-functional requirement in this document has been defined with the understanding that:

- The MVP will run on cost-effective, free-tier infrastructure.
- The product architecture must not become coupled to those infrastructure choices.
- Replacing infrastructure components (database hosting, storage providers, caching layers, deployment platforms) should primarily involve configuration and infrastructure changes rather than application code changes.
- Module boundaries, API contracts, and database design must remain stable as the organization grows from a few users to more than 100,000 employees.

This philosophy ensures that engineering effort invested during the MVP remains valuable throughout the product's lifecycle.

---

## 35. Role-Based Access Control (RBAC)

### Overview

HRMS Portal follows a Role-Based Access Control (RBAC) model with tenant-aware authorization. Every authenticated request is evaluated against:

- Authentication (Who is the user?)
- Tenant (Which company does the user belong to?)
- Role (What is the user's responsibility?)
- Permission (What action is being requested?)
- Resource (Which entity is being accessed?)

Authorization decisions are always enforced on the server.

### Role Hierarchy

```
Super Admin
      │
      ▼
HR Admin
      │
      ▼
Manager
      │
      ▼
Employee
```

Higher roles inherit the permissions of lower roles unless explicitly restricted.

### Permission Matrix

| Module | Employee | Manager | HR Admin | Super Admin |
|---|---|---|---|---|
| Login | ✅ | ✅ | ✅ | ✅ |
| View Profile | ✅ | ✅ | ✅ | ✅ |
| Update Own Password | ✅ | ✅ | ✅ | ✅ |
| Clock In | ✅ | ✅ | ✅ | ✅ |
| Clock Out | ✅ | ✅ | ✅ | ✅ |
| View Own Attendance | ✅ | ✅ | ✅ | ✅ |
| View Team Attendance | ❌ | ✅ | ✅ | ✅ |
| View Organization Attendance | ❌ | ❌ | ✅ | ✅ |
| Correct Attendance | ❌ | ❌ | ✅ | ✅ |
| Apply Leave | ✅ | ✅ | ✅ | ✅ |
| Cancel Pending Leave | ✅ | ✅ | ✅ | ✅ |
| Approve Leave | ❌ | (Future) | ✅ | ✅ |
| Reject Leave | ❌ | (Future) | ✅ | ✅ |
| Create Employee | ❌ | ❌ | ✅ | ✅ |
| Edit Employee | ❌ | ❌ | ✅ | ✅ |
| Deactivate Employee | ❌ | ❌ | ✅ | ✅ |
| Configure Company | ❌ | ❌ | ❌ | ✅ |
| Configure Branches | ❌ | ❌ | ❌ | ✅ |
| Configure Departments | ❌ | ❌ | ❌ | ✅ |
| Configure Roles | ❌ | ❌ | ❌ | ✅ |
| Configure Leave Policies | ❌ | ❌ | ❌ | ✅ |
| Configure Attendance Rules | ❌ | ❌ | ❌ | ✅ |
| View Audit Logs | ❌ | ❌ | (Limited) | ✅ |

## 36. Acceptance Criteria

The MVP is considered complete only when all critical workflows satisfy their acceptance criteria.

### Authentication — Definition of Done

- Users can log in using Email/Password.
- Users can log in using Phone/Password.
- JWT Authentication works correctly.
- Refresh Tokens rotate securely.
- Forgot Password flow works.
- OTP verification works.
- Logout revokes sessions.

### Employee Module

- Employees can view their profile.
- HR can create employees.
- HR can edit employees.
- Employee IDs are generated correctly.
- Duplicate IDs within the same company are prevented.
- Inactive employees cannot log in.

### Attendance

- One Clock-In per day.
- One Clock-Out per day.
- Working hours calculated correctly.
- Attendance history displayed correctly.
- Admin attendance corrections logged.
- Server time used for attendance.

### Leave

- Leave application successful.
- Leave approval workflow functions correctly.
- Leave balance updates after approval.
- Pending leave can be cancelled.
- Approved leave cannot be modified.

### Offline

- Cached data available offline.
- Attendance requests queued.
- Auto-sync executes successfully.
- Duplicate attendance prevented after synchronization.

## 37. Product Risks

Every software product carries technical and business risks.

The objective is not to eliminate all risks but to identify and mitigate them early.

### Technical Risks

**R-001 — Free-tier infrastructure limitations.**

Impact: Medium

Mitigation: Provider-independent architecture.

**R-002 — Future scalability.**

Impact: High

Mitigation: Modular architecture, Stateless APIs, Database indexing, Caching strategy.

**R-003 — Offline synchronization conflicts.**

Impact: Medium

Mitigation: Server remains Source of Truth, Conflict resolution strategy.

**R-004 — Authentication vulnerabilities.**

Impact: High

Mitigation: Refresh Token rotation, bcrypt, JWT expiration, Rate limiting, Audit logging.

**R-005 — Database growth.**

Impact: High

Mitigation: UUIDs, Indexes, Partitioning readiness, Archival strategy.

### Business Risks

- Scope creep.
- Delayed feature requests.
- Changing HR policies.
- Multiple tenant customization.
- Regulatory requirements.

## 38. Product Assumptions

The following assumptions have been made during product planning.

- Organizations have internet connectivity for synchronization.
- Every employee belongs to one company.
- Every employee belongs to one branch.
- Every employee belongs to one department.
- Every employee has one reporting manager.
- HR Admins maintain employee information.
- Companies configure attendance policies.
- Companies configure leave policies.
- Mobile application is the primary user interface.

## 39. Product Constraints

Current MVP constraints include:

- Mobile application only.
- English language.
- PostgreSQL database.
- React Native frontend.
- FastAPI backend.
- Free-tier infrastructure.
- No payroll.
- No GPS attendance.
- No biometric attendance.
- No push notifications.
- No web portal.

These constraints are intentional and do not limit future expansion.

## 40. Product Dependencies

### Internal Dependencies

- Authentication Service
- User Management
- RBAC
- Database
- Offline Storage
- API Layer

### External Dependencies

- Email Service (OTP)
- SMS Provider (Future)
- PostgreSQL Hosting
- Cloud Storage (Future)
- CI/CD Platform
- Monitoring Platform

## 41. MVP Release Checklist

### Product

- Product requirements approved.
- UX finalized.
- API finalized.
- Database finalized.

### Development

- Authentication completed.
- Attendance completed.
- Leave completed.
- Employee Management completed.
- Dashboards completed.
- Offline synchronization completed.

### Quality Assurance

- Unit tests passed.
- Integration tests passed.
- API tests passed.
- Regression tests passed.
- Security testing completed.
- Performance testing completed.

### Deployment

- Production environment configured.
- Environment variables secured.
- Database migrations executed.
- SSL enabled.
- Health checks verified.
- Backup strategy configured.

## 42. MVP Success KPIs

### Product KPIs

| KPI | Target |
|---|---|
| Daily Active Users | >70% of employees |
| Attendance Completion | >95% |
| Leave Approval Time | <24 hours |
| Employee Adoption | >90% |

### Technical KPIs

| KPI | Target |
|---|---|
| Crash-Free Sessions | >99% |
| API Success Rate | >99% |
| Authentication Success | >99% |
| Database Availability | 99.9% |

### Business KPIs

- Reduced manual HR work.
- Reduced attendance disputes.
- Improved employee experience.
- Centralized workforce management.
- Faster onboarding.

## 43. Product Roadmap

### MVP (Version 1)

**Focus:** Core HRMS

**Modules:**
- Authentication
- Attendance
- Leave
- Employee Management
- Dashboard
- Profile
- RBAC
- Offline Support

### Phase 2

- Push Notifications
- Web Portal
- Holiday Calendar
- Company Branding
- Employee Documents
- Shift Scheduling
- Reports
- Analytics

### Phase 3

- Payroll
- Payslips
- Expenses
- Asset Management
- Recruitment
- Performance Reviews
- Organization Charts

### Phase 4

- AI Attendance Insights
- AI Leave Predictions
- HR Analytics
- Workforce Planning
- Employee Engagement
- Chat
- Video Calls

### Phase 5 — Enterprise Platform

- SSO
- Azure AD
- Okta
- Google Workspace
- Multi-region Deployment
- Kubernetes
- Microservices
- Public APIs
- Marketplace Integrations

## 44. Long-Term Product Vision

HRMS Portal is not intended to remain an attendance application.

The long-term vision is to evolve into a comprehensive Human Capital Management (HCM) platform supporting the entire employee lifecycle—from recruitment and onboarding to payroll, performance, learning, engagement, and offboarding.

The architecture established during the MVP intentionally lays the foundation for this evolution by emphasizing modularity, tenant isolation, extensibility, and operational excellence.

## 45. Requirement Traceability Matrix

| Requirement Category | Related Documents |
|---|---|
| Product Vision | PRD |
| Functional Requirements | PRD, TRD |
| Database Design | Schema |
| API Design | TRD |
| UI/UX | Design |
| System Architecture | Architecture |
| User Flows | Flow |
| Development Timeline | Plan |
| Testing Strategy | TRD, Plan |
| Deployment | Architecture, TRD |

This matrix ensures that every product requirement has a clear implementation path and supporting documentation.

## 46. Glossary

| Term | Definition |
|---|---|
| Tenant | A company using the HRMS platform |
| RBAC | Role-Based Access Control |
| UUID | Universally Unique Identifier used internally |
| Employee ID | Business-facing employee identifier (e.g., EMP00001) |
| Attendance Record | Daily clock-in/clock-out data |
| Leave Balance | Remaining leave entitlement for an employee |
| Access Token | Short-lived JWT used for authenticated requests |
| Refresh Token | Long-lived token used to obtain new access tokens |
| Modular Monolith | A single deployable application organized into independent modules |
| Offline Queue | Local storage of pending actions until connectivity is restored |

## 47. Product Approval & Sign-off

| Role | Responsibility | Status |
|---|---|---|
| Product Owner | Product scope and priorities | Pending |
| Engineering Lead | Technical feasibility | Pending |
| UI/UX Lead | Design validation | Pending |
| QA Lead | Test strategy | Pending |
| Security Review | Security validation | Pending |

## 48. Conclusion

HRMS Portal has been conceived as an enterprise-grade, mobile-first HRMS platform that balances immediate business value with long-term architectural sustainability. The MVP intentionally focuses on a carefully selected feature set while establishing patterns and foundations that enable future expansion without disruptive rewrites.

Key architectural commitments include:

- Mobile-first user experience using React Native.
- Secure authentication and authorization with JWT, Refresh Tokens, and RBAC.
- Multi-tenant architecture with complete tenant isolation.
- Scalable modular monolith designed for future microservice migration.
- Offline-first capability with queued synchronization and server-side conflict resolution.
- Provider-agnostic infrastructure to support seamless migration from free-tier services to enterprise cloud platforms.
- Extensible data model capable of supporting future HR modules such as payroll, recruitment, performance management, analytics, and integrations.

This PRD serves as the single source of truth for the product vision, functional expectations, non-functional requirements, business rules, and long-term direction of HRMS Portal. All subsequent technical documentation—including the Technical Requirements Document (TRD), Architecture, Schema, Flow, Design, and Project Plan—must align with the decisions and principles established herein.
