import { apiClient } from '@/api/client/apiClient';

export const operationsService = {
  getServiceRequests: async () => {
    const response = await apiClient.get('/hr/operations/service-requests');
    return response?.data || response;
  },

  getCases: async () => {
    const response = await apiClient.get('/hr/operations/cases');
    return response?.data || response;
  },

  getAutomationRules: async () => {
    const response = await apiClient.get('/hr/operations/automation-rules');
    return response?.data || response;
  },

  getReminders: async () => {
    const response = await apiClient.get('/hr/operations/reminders');
    return response?.data || response;
  },

  getApprovalQueue: async () => {
    const response = await apiClient.get('/hr/operations/approval-queue');
    return response?.data || response;
  },
};
