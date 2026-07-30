import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockDashboardSummary = {
  presentPercentage: 92,
  absentCount: 5,
  lateCount: 2,
  onLeaveCount: 3,
};

const mockRecords = [
  {
    id: 'att-admin-1',
    employee_name: 'Aarav Patel',
    employee_id: 'EMP00001',
    department: 'Engineering',
    shift: 'General (09:00 - 18:00)',
    clock_in: '09:05 AM',
    clock_out: '05:15 PM',
    working_hours: '8.17 hrs',
    status: 'PRESENT',
  },
  {
    id: 'att-admin-2',
    employee_name: 'Priya Sharma',
    employee_id: 'EMP00002',
    department: 'Marketing',
    shift: 'General (09:00 - 18:00)',
    clock_in: '09:45 AM',
    clock_out: '06:00 PM',
    working_hours: '8.25 hrs',
    status: 'LATE',
  },
  {
    id: 'att-admin-3',
    employee_name: 'John Doe',
    employee_id: 'EMP00003',
    department: 'Sales',
    shift: 'General (09:00 - 18:00)',
    clock_in: '--:--',
    clock_out: '--:--',
    working_hours: '0.00 hrs',
    status: 'ABSENT',
  },
  {
    id: 'att-admin-4',
    employee_name: 'Jane Smith',
    employee_id: 'EMP00004',
    department: 'Engineering',
    shift: 'General (09:00 - 18:00)',
    clock_in: '--:--',
    clock_out: '--:--',
    working_hours: '0.00 hrs',
    status: 'LEAVE',
  },
];

export const attendanceService = {
  getAttendance: async (filters) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: mockRecords };
    }
    const response = await apiClient.get('/admin/attendance', { params: filters });
    return response.data;
  },
  
  getAttendanceSummary: async (employeeId, period) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: { employeeId, period, present: 20, absent: 2, late: 1 } };
    }
    const response = await apiClient.get('/admin/attendance/summary', { params: { employeeId, period } });
    return response.data;
  },
  
  getAttendanceTimeline: async (employeeId, date) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { success: true, data: [] };
    }
    const response = await apiClient.get('/admin/attendance/timeline', { params: { employeeId, date } });
    return response.data;
  },
  
  getAttendanceExceptions: async (filters) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: [] };
    }
    const response = await apiClient.get('/admin/attendance/exceptions', { params: filters });
    return response.data;
  },
  
  submitRegularization: async (regularizationData) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return { success: true };
    }
    const response = await apiClient.post('/admin/attendance/regularization', regularizationData);
    return response.data;
  },
  
  getRegularizationHistory: async (attendanceRecordId) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: [] };
    }
    const response = await apiClient.get(`/admin/attendance/regularization/history/${attendanceRecordId}`);
    return response.data;
  },

  getAttendanceDashboardSummary: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return { success: true, data: mockDashboardSummary };
    }
    const response = await apiClient.get('/admin/attendance/dashboard/summary');
    return response.data;
  }
};

