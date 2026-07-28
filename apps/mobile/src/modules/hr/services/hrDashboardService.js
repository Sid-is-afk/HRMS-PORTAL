import { apiClient } from '@/api/client/apiClient';

export const hrDashboardService = {
  getHRDashboard: async () => {
    const response = await apiClient.get('/hr/dashboard/summary');
    return response?.data || response;
  },

  getPendingTasks: async () => {
    const response = await apiClient.get('/hr/dashboard/tasks');
    return response?.data || response;
  },

  getUpcomingEvents: async () => {
    const response = await apiClient.get('/hr/dashboard/events');
    return response?.data || response;
  },

  getRecentActivities: async () => {
    const response = await apiClient.get('/hr/dashboard/activities');
    return response?.data || response;
  },

  getQuickActions: async () => {
    const response = await apiClient.get('/hr/dashboard/quick-actions');
    return response?.data || response;
  },

  getNotifications: async () => {
    const response = await apiClient.get('/hr/dashboard/notifications');
    return response?.data || response;
  },
};
