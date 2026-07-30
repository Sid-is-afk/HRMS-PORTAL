import { apiClient } from '@/api/client/apiClient';

export const platformService = {
  getDashboardSummary: async () => {
    const response = await apiClient.get('/platform/dashboard/summary');
    return response.data;
  },

  getActivities: async () => {
    const response = await apiClient.get('/platform/dashboard/activities');
    return response.data;
  },

  getNotifications: async () => {
    const response = await apiClient.get('/platform/dashboard/notifications');
    return response.data;
  },

  searchPlatform: async (query) => {
    const response = await apiClient.get('/platform/search', { params: { q: query } });
    return response.data;
  }
};
