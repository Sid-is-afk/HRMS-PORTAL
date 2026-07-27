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
          { name: 'HRDashboard', label: 'HR Dashboard', icon: 'view-dashboard' },
          { name: 'HROverview', label: 'HR Overview', icon: 'briefcase-outline' },
          { name: 'HRActivityFeed', label: 'Activity Feed', icon: 'newspaper-variant-outline' },
          { name: 'HRNotifications', label: 'Notifications', icon: 'bell-outline' },
          { name: 'HRQuickActions', label: 'Quick Actions', icon: 'lightning-bolt-outline' },
          { name: 'UpcomingEvents', label: 'Upcoming Events', icon: 'calendar-clock' },
          { name: 'HRSearch', label: 'Search', icon: 'magnify' },
          { name: 'TalentDashboard', label: 'Talent Dashboard', icon: 'account-group-outline' },
          { name: 'JobRequisitions', label: 'Job Requisitions', icon: 'file-document-multiple-outline' },
          { name: 'JobPostings', label: 'Job Postings', icon: 'bullhorn-outline' },
        ];
      case ROLES.ADMIN:
        return [
          { name: 'AdminDashboard', label: 'Admin Dashboard', icon: 'view-dashboard' },
          { name: 'AdminAttendance', label: 'Manage Attendance', icon: 'clock-outline' },
          { name: 'AdminLeave', label: 'Manage Leaves', icon: 'calendar-range' },
          { name: 'AdminIAM', label: 'Identity & Access', icon: 'shield-key-outline' },
          { name: 'AdminMasterData', label: 'Master Data Config', icon: 'database-settings' },
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
