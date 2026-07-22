export const SETTINGS_SECTIONS = {
  ACCOUNT: 'account',
  SECURITY: 'security',
  NOTIFICATIONS: 'notifications',
  PRIVACY: 'privacy',
  LANGUAGE: 'language',
  THEME: 'theme',
  SUPPORT: 'support',
  ABOUT: 'about',
};

export const DEFAULT_SETTINGS = {
  preferences: {
    theme: 'system',
    language: 'en',
  },
  notificationPreferences: {
    push: true,
    email: true,
    sms: false,
  },
  privacySettings: {
    profileVisibility: 'employees',
    showOnlineStatus: true,
  },
  securitySettings: {
    twoFactorEnabled: false,
    biometricsEnabled: false,
  },
};
