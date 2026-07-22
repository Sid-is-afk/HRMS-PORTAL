import { ROLES } from '../roles';
import { ROLE_PERMISSIONS, ACCESSIBLE_MODULES, FEATURE_FLAGS } from '../mapping';

export const rbacService = {
  resolveRole: (user) => {
    if (!user) return null;
    return user.role || ROLES.EMPLOYEE;
  },

  resolvePermissions: (role) => {
    return ROLE_PERMISSIONS[role] || [];
  },

  resolveAccessibleModules: (role) => {
    return ACCESSIBLE_MODULES[role] || [];
  },

  resolveFeatureFlags: (role) => {
    return FEATURE_FLAGS[role] || {};
  },

  resolveNavigation: (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return [
          { name: 'SuperAdminDashboard', label: 'Super Admin Dashboard', icon: 'shield' },
          { name: 'SystemSettings', label: 'System Settings', icon: 'settings' },
        ];
      case ROLES.HR:
        return [
          { name: 'HRDashboard', label: 'HR Dashboard', icon: 'users' },
          { name: 'EmployeeManagement', label: 'Manage Employees', icon: 'user-cog' },
        ];
      case ROLES.ADMIN:
        return [
          { name: 'AdminDashboard', label: 'Admin Dashboard', icon: 'view-dashboard' },
          { name: 'AttendanceManagement', label: 'Manage Attendance', icon: 'clock-outline' },
          { name: 'LeaveManagement', label: 'Manage Leaves', icon: 'calendar-range' },
        ];
      case ROLES.EMPLOYEE:
      default:
        return [
          { name: 'Home', label: 'Dashboard', icon: 'home' },
          { name: 'Attendance', label: 'Attendance', icon: 'fingerprint' },
          { name: 'Leave', label: 'Leave', icon: 'calendar-days' },
          { name: 'Profile', label: 'Profile', icon: 'user' },
        ];
    }
  },
};
