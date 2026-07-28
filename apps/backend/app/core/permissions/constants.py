class Permissions:
    # Auth
    LOGIN = "auth:login"
    REFRESH_TOKEN = "auth:refresh"
    # Employee
    VIEW_EMPLOYEES = "employee:view"
    CREATE_EMPLOYEE = "employee:create"
    UPDATE_EMPLOYEE = "employee:update"
    DELETE_EMPLOYEE = "employee:delete"
    # Attendance
    VIEW_OWN_ATTENDANCE = "attendance:view_own"
    VIEW_ALL_ATTENDANCE = "attendance:view_all"
    MARK_ATTENDANCE = "attendance:mark"
    CORRECT_ATTENDANCE = "attendance:correct"
    # Leave
    VIEW_OWN_LEAVE = "leave:view_own"
    VIEW_ALL_LEAVE = "leave:view_all"
    APPLY_LEAVE = "leave:apply"
    APPROVE_LEAVE = "leave:approve"
    # Admin
    MANAGE_COMPANY = "admin:manage_company"
    MANAGE_BRANCHES = "admin:manage_branches"
    MANAGE_DEPARTMENTS = "admin:manage_departments"
    MANAGE_ROLES = "admin:manage_roles"
    VIEW_AUDIT_LOGS = "admin:view_audit_logs"
    # Platform
    MANAGE_TENANTS = "platform:manage_tenants"
    VIEW_PLATFORM_ANALYTICS = "platform:view_analytics"
    MANAGE_PLATFORM_CONFIG = "platform:manage_config"
