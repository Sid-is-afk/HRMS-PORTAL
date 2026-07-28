import { apiClient } from '@/api/client/apiClient';

export const lifecycleService = {
  getPendingConversions: async () => {
    const response = await apiClient.get('/hr/employee-lifecycle/conversions');
    return response?.data || response;
  },

  convertCandidate: async (conversionData) => {
    const response = await apiClient.post('/hr/employee-lifecycle/conversions', conversionData);
    return response?.data || response;
  },

  getOnboardingTasks: async () => {
    const response = await apiClient.get('/hr/employee-lifecycle/onboarding-tasks');
    return response?.data || response;
  },

  updateTaskStatus: async (taskId, isCompleted) => {
    const response = await apiClient.put(`/hr/employee-lifecycle/onboarding-tasks/${taskId}/status`, { isCompleted });
    return response?.data || response;
  },

  getActiveProbations: async () => {
    const response = await apiClient.get('/hr/employee-lifecycle/probations');
    return response?.data || response;
  },
};
