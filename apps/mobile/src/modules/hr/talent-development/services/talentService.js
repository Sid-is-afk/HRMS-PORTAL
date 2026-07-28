import { apiClient } from '@/api/client/apiClient';

export const talentService = {
  getGoals: async () => {
    const response = await apiClient.get('/hr/talent-development/goals');
    return response?.data || response;
  },

  getLearningCatalog: async () => {
    const response = await apiClient.get('/hr/talent-development/learning-catalog');
    return response?.data || response;
  },

  getComplianceStatus: async () => {
    const response = await apiClient.get('/hr/talent-development/compliance');
    return response?.data || response;
  },
};
