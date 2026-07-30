import { apiClient } from '@/api/client/apiClient';

export const attendanceService = {
  getAttendance: async (filters) => {
    const response = await apiClient.get('/admin/attendance', { params: filters });
    return response.data;
  },
  
  getAttendanceSummary: async (employeeId, period) => {
    const response = await apiClient.get('/admin/attendance/summary', { params: { employeeId, period } });
    return response.data;
  },
  
  getAttendanceTimeline: async (employeeId, date) => {
    const response = await apiClient.get('/admin/attendance/timeline', { params: { employeeId, date } });
    return response.data;
  },
  
  getAttendanceExceptions: async (filters) => {
    const response = await apiClient.get('/admin/attendance/exceptions', { params: filters });
    return response.data;
  },
  
  submitRegularization: async (regularizationData) => {
    const response = await apiClient.post('/admin/attendance/regularization', regularizationData);
    return response.data;
  },
  
  getRegularizationHistory: async (attendanceRecordId) => {
    const response = await apiClient.get(`/admin/attendance/regularization/history/${attendanceRecordId}`);
    return response.data;
  },

  getAttendanceDashboardSummary: async () => {
    const response = await apiClient.get('/admin/attendance/dashboard/summary');
    return response.data;
  }
};
