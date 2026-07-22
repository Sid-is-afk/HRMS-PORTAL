import { create } from 'zustand';
import { settingsService } from '../services/settingsService';
import { DEFAULT_SETTINGS } from '../utils/settingsTypes';

const initialState = {
  settings: null,
  preferences: DEFAULT_SETTINGS.preferences,
  notificationPreferences: DEFAULT_SETTINGS.notificationPreferences,
  privacySettings: DEFAULT_SETTINGS.privacySettings,
  securitySettings: DEFAULT_SETTINGS.securitySettings,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

export const useSettingsStore = create((set, get) => ({
  ...initialState,

  clearError: () => set({ error: null }),

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await settingsService.getSettings();
      set({
        settings: data,
        preferences: data.preferences || get().preferences,
        notificationPreferences: data.notificationPreferences || get().notificationPreferences,
        privacySettings: data.privacySettings || get().privacySettings,
        securitySettings: data.securitySettings || get().securitySettings,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({
        error: error.message || 'Unable to load your settings right now.',
        isLoading: false,
      });
      throw error;
    }
  },

  updateSettings: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const data = await settingsService.updateSettings(payload);
      set({ settings: data, isSubmitting: false });
      return data;
    } catch (error) {
      set({ error: error.message || 'Settings update failed.', isSubmitting: false });
      throw error;
    }
  },

  updatePreferences: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const data = await settingsService.updatePreferences(payload);
      set({ preferences: { ...get().preferences, ...payload }, isSubmitting: false });
      return data;
    } catch (error) {
      set({ error: error.message || 'Preferences update failed.', isSubmitting: false });
      throw error;
    }
  },

  updateNotificationSettings: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const data = await settingsService.updateNotificationSettings(payload);
      set({ notificationPreferences: { ...get().notificationPreferences, ...payload }, isSubmitting: false });
      return data;
    } catch (error) {
      set({ error: error.message || 'Notification settings update failed.', isSubmitting: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isSubmitting: true, error: null });
    try {
      await settingsService.logout();
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: error.message || 'Logout failed.', isSubmitting: false });
      throw error;
    }
  },
}));
