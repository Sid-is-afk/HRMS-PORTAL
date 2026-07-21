import { create } from 'zustand';
import { dashboardService } from '../services/dashboardService';

export const useDashboardStore = create((set) => ({
  summary: null,
  announcements: [],
  holidays: [],
  isLoading: false,
  isRefreshing: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [summary, announcements, holidays] = await Promise.all([
        dashboardService.getDashboardSummary(),
        dashboardService.getAnnouncements(),
        dashboardService.getUpcomingHolidays(),
      ]);
      set({ summary, announcements, holidays, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load dashboard', isLoading: false });
    }
  },

  refreshDashboardData: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const [summary, announcements, holidays] = await Promise.all([
        dashboardService.getDashboardSummary(),
        dashboardService.getAnnouncements(),
        dashboardService.getUpcomingHolidays(),
      ]);
      set({ summary, announcements, holidays, isRefreshing: false });
    } catch (err) {
      set({ error: err.message || 'Failed to refresh dashboard', isRefreshing: false });
    }
  },

  clearError: () => set({ error: null })
}));
