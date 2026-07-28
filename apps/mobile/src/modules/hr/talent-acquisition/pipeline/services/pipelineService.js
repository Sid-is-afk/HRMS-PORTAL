import { apiClient } from '@/api/client/apiClient';

export const pipelineService = {
  getCandidates: async (filters = {}) => {
    const response = await apiClient.get('/hr/recruitment/candidates', { params: filters });
    return response?.data || response;
  },

  getCandidate: async (id) => {
    const response = await apiClient.get(`/hr/recruitment/candidates/${id}`);
    return response?.data || response;
  },

  createCandidate: async (data) => {
    const response = await apiClient.post('/hr/recruitment/candidates', data);
    return response?.data || response;
  },

  updateCandidateStage: async (id, stage) => {
    const response = await apiClient.put(`/hr/recruitment/candidates/${id}/stage`, { stage });
    return response?.data || response;
  },

  scheduleInterview: async (candidateId, data) => {
    const response = await apiClient.post(`/hr/recruitment/candidates/${candidateId}/interviews`, data);
    return response?.data || response;
  },

  rescheduleInterview: async (interviewId, newTimeData) => {
    const response = await apiClient.put(`/hr/recruitment/interviews/${interviewId}/reschedule`, newTimeData);
    return response?.data || response;
  },

  cancelInterview: async (interviewId) => {
    const response = await apiClient.post(`/hr/recruitment/interviews/${interviewId}/cancel`);
    return response?.data || response;
  },

  submitInterviewFeedback: async (interviewId, data) => {
    const response = await apiClient.post(`/hr/recruitment/interviews/${interviewId}/feedback`, data);
    return response?.data || response;
  },

  addCandidateNote: async (candidateId, noteText) => {
    const response = await apiClient.post(`/hr/recruitment/candidates/${candidateId}/notes`, { content: noteText });
    return response?.data || response;
  },

  getPipeline: async () => {
    const response = await apiClient.get('/hr/recruitment/pipeline');
    return response?.data || response;
  },

  getInterviewDashboard: async () => {
    const response = await apiClient.get('/hr/recruitment/interviews/dashboard');
    return response?.data || response;
  },
};
