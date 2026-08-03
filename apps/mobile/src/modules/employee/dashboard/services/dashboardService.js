import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { USE_REAL_EMPLOYEE_API } from '@/shared/constants/env';
import { mockData } from '@/tests/mocks/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardService = {
  getDashboardSummary: async () => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(400);
      return mockData.dashboard.summary;
    }
    const response = await apiClient.get(API_ROUTES.DASHBOARD.SUMMARY);
    return response?.data || response;
  },

  getAnnouncements: async () => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(300);
      return mockData.dashboard.announcements;
    }
    const response = await apiClient.get(API_ROUTES.DASHBOARD.ANNOUNCEMENTS);
    return response?.data || response;
  },

  getUpcomingHolidays: async () => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(300);
      return mockData.dashboard.holidays;
    }
    const response = await apiClient.get(API_ROUTES.DASHBOARD.HOLIDAYS);
    return response?.data || response;
  },
};

