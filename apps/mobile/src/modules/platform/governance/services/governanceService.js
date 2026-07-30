import { apiClient } from '@/api/client/apiClient';

export const governanceService = {
  getDashboardSummary: async () => {
    const response = await apiClient.get('/platform/governance/dashboard/summary');
    return response.data;
  },

  getFeatures: async () => {
    const response = await apiClient.get('/platform/governance/features');
    return response.data;
  },

  getModules: async () => {
    const response = await apiClient.get('/platform/governance/modules');
    return response.data;
  },

  getSubscriptions: async () => {
    const response = await apiClient.get('/platform/governance/subscriptions');
    return response.data;
  },
};
