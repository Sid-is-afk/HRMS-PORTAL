import { apiClient } from '@/api/client/apiClient';

export const talentService = {
  getTalentDashboard: async () => {
    const response = await apiClient.get('/hr/recruitment/dashboard');
    return response?.data || response;
  },

  getJobRequisitions: async (filters = {}) => {
    const response = await apiClient.get('/hr/recruitment/requisitions', { params: filters });
    return response?.data || response;
  },

  createJobRequisition: async (data) => {
    const response = await apiClient.post('/hr/recruitment/requisitions', data);
    return response?.data || response;
  },

  updateJobRequisition: async (id, data) => {
    const response = await apiClient.put(`/hr/recruitment/requisitions/${id}`, data);
    return response?.data || response;
  },

  getJobPostings: async (filters = {}) => {
    const response = await apiClient.get('/hr/recruitment/postings', { params: filters });
    return response?.data || response;
  },

  publishJobPosting: async (requisitionId, data) => {
    const response = await apiClient.post(`/hr/recruitment/requisitions/${requisitionId}/publish`, data);
    return response?.data || response;
  },

  archiveJobPosting: async (id) => {
    const response = await apiClient.post(`/hr/recruitment/postings/${id}/archive`);
    return response?.data || response;
  },

  getHiringActivities: async () => {
    const response = await apiClient.get('/hr/recruitment/activities');
    return response?.data || response;
  },
};
