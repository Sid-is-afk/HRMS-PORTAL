import { ROLES } from './roles';
import { PERMISSIONS } from './permissions';

export const ROLE_PERMISSIONS = {
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_LEAVE,
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.VIEW_LEAVE,
    PERMISSIONS.APPROVE_LEAVE,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_DEPARTMENTS,
    PERMISSIONS.MANAGE_SHIFTS,
    PERMISSIONS.MANAGE_SETTINGS,
  ],
  [ROLES.HR]: [
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.CREATE_EMPLOYEE,
    PERMISSIONS.UPDATE_EMPLOYEE,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.VIEW_LEAVE,
    PERMISSIONS.APPROVE_LEAVE,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_DEPARTMENTS,
    PERMISSIONS.MANAGE_SHIFTS,
  ],
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
};

export const ACCESSIBLE_MODULES = {
  [ROLES.EMPLOYEE]: ['employee'],
  [ROLES.ADMIN]: ['employee', 'admin'],
  [ROLES.HR]: ['employee', 'hr', 'admin'],
  [ROLES.SUPER_ADMIN]: ['employee', 'admin', 'hr', 'superadmin'],
};

export const FEATURE_FLAGS = {
  [ROLES.EMPLOYEE]: {
    enableSelfClockIn: true,
    enableSelfLeaveRequest: true,
    enableAdminPanel: false,
  },
  [ROLES.ADMIN]: {
    enableSelfClockIn: true,
    enableSelfLeaveRequest: true,
    enableAdminPanel: true,
    enableAdvancedReporting: true,
  },
  [ROLES.HR]: {
    enableSelfClockIn: true,
    enableSelfLeaveRequest: true,
    enableAdminPanel: true,
    enableBulkUpload: true,
  },
  [ROLES.SUPER_ADMIN]: {
    enableSelfClockIn: true,
    enableSelfLeaveRequest: true,
    enableAdminPanel: true,
    enableSystemLogs: true,
    enableMultiTenantSettings: true,
  },
};
