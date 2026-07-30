import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockDashboardSummary = {
  totalRequests: 18,
  pendingApproval: 4,
  approvedToday: 2,
  onLeaveToday: 3,
};

let mockRequests = [
  {
    id: 'leave-admin-1',
    employee_name: 'Aarav Patel',
    employee_id: 'EMP00001',
    department: 'Engineering',
    leave_type_name: 'Annual Leave',
    start_date: '2026-08-01',
    end_date: '2026-08-05',
    status: 'PENDING',
    reason: 'Family trip',
  },
  {
    id: 'leave-admin-2',
    employee_name: 'Priya Sharma',
    employee_id: 'EMP00002',
    department: 'Marketing',
    leave_type_name: 'Sick Leave',
    start_date: '2026-07-30',
    end_date: '2026-07-31',
    status: 'APPROVED',
    reason: 'Fever',
  },
  {
    id: 'leave-admin-3',
    employee_name: 'John Doe',
    employee_id: 'EMP00003',
    department: 'Sales',
    leave_type_name: 'Casual Leave',
    start_date: '2026-08-10',
    end_date: '2026-08-11',
    status: 'PENDING',
    reason: 'Personal work',
  },
];

export const leaveService = {
  getLeaveRequests: async (filters) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: mockRequests };
    }
    const response = await apiClient.get('/admin/leave/requests', { params: filters });
    return response.data;
  },
  
  getLeaveDetails: async (leaveId) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const req = mockRequests.find((r) => r.id === leaveId);
      return { success: true, data: req };
    }
    const response = await apiClient.get(`/admin/leave/requests/${leaveId}`);
    return response.data;
  },
  
  getLeaveBalances: async (employeeId) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: [] };
    }
    const response = await apiClient.get(`/admin/leave/balances/${employeeId}`);
    return response.data;
  },
  
  getLeavePolicies: async () => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { success: true, data: [] };
    }
    const response = await apiClient.get('/admin/leave/policies');
    return response.data;
  },
  
  submitLeaveRequest: async (leaveData) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const newReq = {
        id: `leave-admin-${Date.now()}`,
        employee_name: 'Aarav Patel',
        employee_id: 'EMP00001',
        department: 'Engineering',
        leave_type_name: leaveData.leave_type_name || 'Annual Leave',
        start_date: leaveData.start_date,
        end_date: leaveData.end_date,
        status: 'PENDING',
        reason: leaveData.reason,
      };
      mockRequests = [newReq, ...mockRequests];
      return { success: true, data: newReq };
    }
    const response = await apiClient.post('/admin/leave/requests', leaveData);
    return response.data;
  },
  
  approveLeave: async (leaveId, comments) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      mockRequests = mockRequests.map((r) => r.id === leaveId ? { ...r, status: 'APPROVED' } : r);
      return { success: true };
    }
    const response = await apiClient.post(`/admin/leave/requests/${leaveId}/approve`, { comments });
    return response.data;
  },
  
  rejectLeave: async (leaveId, comments) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      mockRequests = mockRequests.map((r) => r.id === leaveId ? { ...r, status: 'REJECTED' } : r);
      return { success: true };
    }
    const response = await apiClient.post(`/admin/leave/requests/${leaveId}/reject`, { comments });
    return response.data;
  },

  cancelLeave: async (leaveId) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      mockRequests = mockRequests.map((r) => r.id === leaveId ? { ...r, status: 'CANCELLED' } : r);
      return { success: true };
    }
    const response = await apiClient.post(`/admin/leave/requests/${leaveId}/cancel`);
    return response.data;
  },
  
  getLeaveCalendar: async (startDate, endDate) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: [] };
    }
    const response = await apiClient.get('/admin/leave/calendar', { params: { startDate, endDate } });
    return response.data;
  },

  getLeaveDashboardSummary: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return { success: true, data: mockDashboardSummary };
    }
    const response = await apiClient.get('/admin/leave/dashboard/summary');
    return response.data;
  }
};

