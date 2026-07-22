import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { USE_MOCK_DATA } from '@/shared/constants/env';
import { mockData } from '@/tests/mocks/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const settingsService = {
  async getSettings() {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockData.settings;
    }
    const response = await apiClient.get(API_ROUTES.SETTINGS.GET);
    return response?.data || response;
  },

  async updateSettings(payload) {
    if (USE_MOCK_DATA) {
      await delay(500);
      return payload;
    }
    const response = await apiClient.put(API_ROUTES.SETTINGS.UPDATE, payload);
    return response?.data || response;
  },

  async getPreferences() {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockData.settings.preferences;
    }
    const response = await apiClient.get(API_ROUTES.SETTINGS.PREFERENCES);
    return response?.data || response;
  },

  async updatePreferences(payload) {
    if (USE_MOCK_DATA) {
      await delay(400);
      return payload;
    }
    const response = await apiClient.put(API_ROUTES.SETTINGS.PREFERENCES, payload);
    return response?.data || response;
  },

  async getNotificationSettings() {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockData.settings.notificationPreferences;
    }
    const response = await apiClient.get(API_ROUTES.SETTINGS.NOTIFICATIONS);
    return response?.data || response;
  },

  async updateNotificationSettings(payload) {
    if (USE_MOCK_DATA) {
      await delay(400);
      return payload;
    }
    const response = await apiClient.put(API_ROUTES.SETTINGS.NOTIFICATIONS, payload);
    return response?.data || response;
  },

  async logout() {
    if (USE_MOCK_DATA) {
      await delay(400);
      return { success: true };
    }
    const response = await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    return response?.data || response;
  },

  async contactSupport(payload) {
    if (USE_MOCK_DATA) {
      await delay(400);
      return { success: true, message: 'Support request received.' };
    }
    const response = await apiClient.post(API_ROUTES.SETTINGS.SUPPORT, payload);
    return response?.data || response;
  },
};

