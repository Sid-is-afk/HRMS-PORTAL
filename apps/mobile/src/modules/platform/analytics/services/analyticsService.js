import { apiClient } from '@/api/client/apiClient';

export const analyticsService = {
  getExecutiveSummary: async () => {
    const response = await apiClient.get('/platform/analytics/dashboard/summary');
    return response.data;
  },

  getTrendMetrics: async () => {
    const response = await apiClient.get('/platform/analytics/trends');
    return response.data;
  },

  getUsageMetrics: async () => {
    const response = await apiClient.get('/platform/analytics/usage');
    return response.data;
  },
};
