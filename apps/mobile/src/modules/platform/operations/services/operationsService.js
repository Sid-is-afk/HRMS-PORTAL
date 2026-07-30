import { apiClient } from '@/api/client/apiClient';

export const operationsService = {
  getDashboardSummary: async () => {
    const response = await apiClient.get('/platform/operations/dashboard/summary');
    return response.data;
  },

  getServices: async () => {
    const response = await apiClient.get('/platform/operations/services');
    return response.data;
  },

  getIncidents: async () => {
    const response = await apiClient.get('/platform/operations/incidents');
    return response.data;
  },

  getLogs: async () => {
    const response = await apiClient.get('/platform/operations/logs');
    return response.data;
  },
};
