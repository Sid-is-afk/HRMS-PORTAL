import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockDashboardData = {
  stats: {
    totalEmployees: 154,
    activeEmployees: 148,
    onLeaveToday: 6,
    presentToday: 138,
    lateToday: 4,
    departmentsCount: 8,
  },
  system: {
    status: 'Healthy',
    apiLatency: 35,
    lastSyncTime: new Date().toISOString(),
    isOnline: true,
  },
  activities: [
    {
      id: 'act-1',
      type: 'ATTENDANCE',
      description: 'Aarav Patel checked in late (09:15 AM)',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      performedBy: 'Aarav Patel',
    },
    {
      id: 'act-2',
      type: 'LEAVE',
      description: 'Casual Leave request submitted by Priya Sharma',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      performedBy: 'Priya Sharma',
    },
    {
      id: 'act-3',
      type: 'PROFILE',
      description: 'Emergency contacts updated for Vikram Singh',
      timestamp: new Date(Date.now() - 300 * 60000).toISOString(),
      performedBy: 'Vikram Singh',
    },
    {
      id: 'act-4',
      type: 'SYSTEM',
      description: 'Weekly backup completed successfully',
      timestamp: new Date(Date.now() - 720 * 60000).toISOString(),
      performedBy: 'System Cron',
    },
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'Performance Review Cycle 2026',
      date: new Date(Date.now() - 1440 * 60000).toISOString(),
      summary: 'The self-evaluation portal is now open for all employees.',
      author: 'HR Department',
    },
    {
      id: 'ann-2',
      title: 'Office Relocation Update',
      date: new Date(Date.now() - 2880 * 60000).toISOString(),
      summary: 'Renovations for the new floor are nearing completion.',
      author: 'Admin Team',
    },
  ],
  quickActions: [
    { id: 'qa-emp', label: 'Manage Employees', icon: 'account-multiple', route: 'AdminEmployeeManagement', permission: 'VIEW_EMPLOYEE' },
    { id: 'qa-att', label: 'Attendance logs', icon: 'clock-check-outline', route: 'AdminAttendance', permission: 'VIEW_ATTENDANCE' },
    { id: 'qa-leave', label: 'Approve Leaves', icon: 'calendar-check', route: 'AdminLeave', permission: 'APPROVE_LEAVE' },
    { id: 'qa-dept', label: 'Departments', icon: 'office-building', route: 'AdminDepartments', permission: 'MANAGE_DEPARTMENTS' },
    { id: 'qa-rep', label: 'System Reports', icon: 'file-chart-outline', route: 'AdminReports', permission: 'VIEW_REPORTS' },
    { id: 'qa-ann', label: 'Post Announcement', icon: 'bullhorn-outline', route: 'AdminAnnouncements', permission: 'MANAGE_SYSTEM' },
    { id: 'qa-set', label: 'Portal Settings', icon: 'cog-outline', route: 'AdminSettings', permission: 'MANAGE_SETTINGS' },
  ],
};

export const dashboardService = {
  getDashboardSummary: async () => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return mockDashboardData;
    }
    const response = await apiClient.get('/admin/dashboard/summary');
    return response?.data || response;
  },

  getAttendanceSummary: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return {
        present: mockDashboardData.stats.presentToday,
        late: mockDashboardData.stats.lateToday,
        absent: mockDashboardData.stats.totalEmployees - mockDashboardData.stats.presentToday - mockDashboardData.stats.onLeaveToday,
        onLeave: mockDashboardData.stats.onLeaveToday,
      };
    }
    const response = await apiClient.get('/admin/dashboard/attendance');
    return response?.data || response;
  },

  getLeaveSummary: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return {
        pendingRequests: 4,
        approvedThisMonth: 18,
        rejectedThisMonth: 2,
      };
    }
    const response = await apiClient.get('/admin/dashboard/leaves');
    return response?.data || response;
  },

  getEmployeeSummary: async () => {
    if (USE_MOCK_DATA) {
      await delay(450);
      return {
        total: mockDashboardData.stats.totalEmployees,
        active: mockDashboardData.stats.activeEmployees,
        newHiresThisMonth: 5,
        turnoverRate: '0.8%',
      };
    }
    const response = await apiClient.get('/admin/dashboard/employees');
    return response?.data || response;
  },

  getRecentActivities: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockDashboardData.activities;
    }
    const response = await apiClient.get('/admin/dashboard/activities');
    return response?.data || response;
  },

  getSystemHealth: async () => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockDashboardData.system;
    }
    const response = await apiClient.get('/admin/dashboard/system-health');
    return response?.data || response;
  },
};
