import { useEffect } from 'react';
import { useSettingsStore } from '@/modules/employee/settings/store/settingsStore';

export function useSettings() {
  const store = useSettingsStore();
  const { settings, fetchSettings } = store;

  useEffect(() => {
    if (!settings) {
      fetchSettings();
    }
  }, [settings, fetchSettings]);

  return {
    settings: store.settings,
    preferences: store.preferences,
    notificationPreferences: store.notificationPreferences,
    privacySettings: store.privacySettings,
    securitySettings: store.securitySettings,
    isLoading: store.isLoading,
    isSubmitting: store.isSubmitting,
    error: store.error,
    fetchSettings: store.fetchSettings,
    updateSettings: store.updateSettings,
    updatePreferences: store.updatePreferences,
    updateNotificationSettings: store.updateNotificationSettings,
    logout: store.logout,
    clearError: store.clearError,
  };
}
