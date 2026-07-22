import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { USE_MOCK_DATA } from '@/shared/constants/env';
import { mockData } from '@/tests/mocks/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (identifier, password) => {
    if (USE_MOCK_DATA) {
      await delay(800);
      return mockData.auth.loginResponse;
    }
    const payload = { identifier, password };
    const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, payload);
    return response?.data || response;
  },

  refreshToken: async (refreshToken) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockData.auth.loginResponse; // Returns new tokens
    }
    const response = await apiClient.post(API_ROUTES.AUTH.REFRESH, { refreshToken });
    return response?.data || response;
  },

  logout: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return { success: true };
    }
    const response = await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    return response?.data || response;
  },

  validateSession: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockData.auth.validateResponse;
    }
    const response = await apiClient.get(API_ROUTES.AUTH.VALIDATE);
    return response?.data || response;
  },

  getProfile: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockData.profile.main;
    }
    const response = await apiClient.get(API_ROUTES.AUTH.ME);
    return response?.data || response;
  },
};

