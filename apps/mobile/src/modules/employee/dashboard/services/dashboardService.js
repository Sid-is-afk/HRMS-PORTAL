import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';

export const dashboardService = {
  getDashboardSummary: async () => {
    const response = await apiClient.get(API_ROUTES.DASHBOARD.SUMMARY);
    return response?.data || response;
  },

  getAnnouncements: async () => {
    const response = await apiClient.get(API_ROUTES.DASHBOARD.ANNOUNCEMENTS);
    return response?.data || response;
  },

  getUpcomingHolidays: async () => {
    const response = await apiClient.get(API_ROUTES.DASHBOARD.HOLIDAYS);
    return response?.data || response;
  },
};
