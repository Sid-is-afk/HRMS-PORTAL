import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';

export const settingsService = {
  async getSettings() {
    const response = await apiClient.get(API_ROUTES.SETTINGS.GET);
    return response?.data || response;
  },

  async updateSettings(payload) {
    const response = await apiClient.put(API_ROUTES.SETTINGS.UPDATE, payload);
    return response?.data || response;
  },

  async getPreferences() {
    const response = await apiClient.get(API_ROUTES.SETTINGS.PREFERENCES);
    return response?.data || response;
  },

  async updatePreferences(payload) {
    const response = await apiClient.put(API_ROUTES.SETTINGS.PREFERENCES, payload);
    return response?.data || response;
  },

  async getNotificationSettings() {
    const response = await apiClient.get(API_ROUTES.SETTINGS.NOTIFICATIONS);
    return response?.data || response;
  },

  async updateNotificationSettings(payload) {
    const response = await apiClient.put(API_ROUTES.SETTINGS.NOTIFICATIONS, payload);
    return response?.data || response;
  },

  async logout() {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    return response?.data || response;
  },

  async contactSupport(payload) {
    const response = await apiClient.post(API_ROUTES.SETTINGS.SUPPORT, payload);
    return response?.data || response;
  },
};
