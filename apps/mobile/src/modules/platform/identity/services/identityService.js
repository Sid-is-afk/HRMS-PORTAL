import { apiClient } from '@/api/client/apiClient';

export const identityService = {
  getDashboardSummary: async () => {
    const response = await apiClient.get('/platform/identity/dashboard/summary');
    return response.data;
  },

  getPlatformUsers: async () => {
    const response = await apiClient.get('/platform/identity/users');
    return response.data;
  },

  getGlobalRoles: async () => {
    const response = await apiClient.get('/platform/identity/roles');
    return response.data;
  },

  getSessions: async () => {
    const response = await apiClient.get('/platform/identity/sessions');
    return response.data;
  },
};
