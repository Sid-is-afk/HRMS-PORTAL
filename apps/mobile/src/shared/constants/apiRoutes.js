export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VALIDATE: '/auth/validate',
    ME: '/auth/me',
  },
  EMPLOYEE: {
    PROFILE: '/employee/profile',
    DIRECTORY: '/employee/directory',
  },
  ATTENDANCE: {
    TODAY: '/attendance/today',
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
    HISTORY: '/attendance/history',
    SUMMARY: '/attendance/summary',
  },
  LEAVE: {
    APPLY: '/leave/apply',
    HISTORY: '/leave/history',
    BALANCE: '/leave/balance',
    CANCEL: '/leave/cancel',
    TYPES: '/leave/types',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/read',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    EMPLOYMENT: '/profile/employment',
    EMERGENCY_CONTACTS: '/profile/emergency-contacts',
    AVATAR: '/profile/avatar',
    CHANGE_PASSWORD: '/profile/change-password',
    DOCUMENTS: '/profile/documents',
    ACCOUNT: '/profile/account',
  },
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    PREFERENCES: '/settings/preferences',
    NOTIFICATIONS: '/settings/notifications',
    SUPPORT: '/support/contact',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    ANNOUNCEMENTS: '/dashboard/announcements',
    HOLIDAYS: '/dashboard/holidays',
  },
};

