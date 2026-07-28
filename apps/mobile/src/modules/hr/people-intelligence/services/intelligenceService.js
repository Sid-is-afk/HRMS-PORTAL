import { apiClient } from '@/api/client/apiClient';

export const intelligenceService = {
  getExecutiveDashboard: async () => {
    const response = await apiClient.get('/hr/people-intelligence/executive-dashboard');
    return response?.data || response;
  },

  getWorkforceAnalytics: async () => {
    const response = await apiClient.get('/hr/people-intelligence/workforce-analytics');
    return response?.data || response;
  },

  getInsights: async () => {
    const response = await apiClient.get('/hr/people-intelligence/insights');
    return response?.data || response;
  },
};
