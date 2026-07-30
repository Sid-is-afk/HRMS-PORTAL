import { apiClient } from '@/api/client/apiClient';

export const tenantService = {
  getDashboardSummary: async () => {
    const response = await apiClient.get('/platform/tenants/dashboard/summary');
    return response.data;
  },

  getTenants: async () => {
    const response = await apiClient.get('/platform/tenants');
    return response.data;
  },

  getTenantById: async (id) => {
    const response = await apiClient.get(`/platform/tenants/${id}`);
    return response.data;
  },

  getLifecycleTimeline: async (tenantId) => {
    const response = await apiClient.get(`/platform/tenants/${tenantId}/lifecycle`);
    return response.data;
  }
};
