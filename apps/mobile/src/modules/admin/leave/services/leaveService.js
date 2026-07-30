import { apiClient } from '@/api/client/apiClient';

export const leaveService = {
  getLeaveRequests: async (filters) => {
    const response = await apiClient.get('/admin/leave/requests', { params: filters });
    return response.data;
  },
  
  getLeaveDetails: async (leaveId) => {
    const response = await apiClient.get(`/admin/leave/requests/${leaveId}`);
    return response.data;
  },
  
  getLeaveBalances: async (employeeId) => {
    const response = await apiClient.get(`/admin/leave/balances/${employeeId}`);
    return response.data;
  },
  
  getLeavePolicies: async () => {
    const response = await apiClient.get('/admin/leave/policies');
    return response.data;
  },
  
  submitLeaveRequest: async (leaveData) => {
    const response = await apiClient.post('/admin/leave/requests', leaveData);
    return response.data;
  },
  
  approveLeave: async (leaveId, comments) => {
    const response = await apiClient.post(`/admin/leave/requests/${leaveId}/approve`, { comments });
    return response.data;
  },
  
  rejectLeave: async (leaveId, comments) => {
    const response = await apiClient.post(`/admin/leave/requests/${leaveId}/reject`, { comments });
    return response.data;
  },

  cancelLeave: async (leaveId) => {
    const response = await apiClient.post(`/admin/leave/requests/${leaveId}/cancel`);
    return response.data;
  },
  
  getLeaveCalendar: async (startDate, endDate) => {
    const response = await apiClient.get('/admin/leave/calendar', { params: { startDate, endDate } });
    return response.data;
  },

  getLeaveDashboardSummary: async () => {
    const response = await apiClient.get('/admin/leave/dashboard/summary');
    return response.data;
  }
};
