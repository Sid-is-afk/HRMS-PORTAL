import { create } from 'zustand';
import { dashboardService } from '../services/dashboardService';

export const useAdminDashboardStore = create((set, get) => ({
  summary: null,
  attendanceSummary: null,
  leaveSummary: null,
  employeeSummary: null,
  recentActivities: [],
  systemHealth: null,

  // Widget visibility and configuration
  widgets: [
    { id: 'kpi', title: 'Organization KPI', visible: true, order: 1, size: 'large' },
    { id: 'employee', title: 'Employee Summary', visible: true, order: 2, size: 'medium' },
    { id: 'attendance', title: 'Today\'s Attendance', visible: true, order: 3, size: 'medium' },
    { id: 'leave', title: 'Leave Summary', visible: true, order: 4, size: 'medium' },
    { id: 'approvals', title: 'Pending Approvals', visible: true, order: 5, size: 'medium' },
    { id: 'quickActions', title: 'Quick Actions', visible: true, order: 6, size: 'large' },
    { id: 'activities', title: 'Recent Activity', visible: true, order: 7, size: 'medium' },
    { id: 'announcements', title: 'Announcements', visible: true, order: 8, size: 'medium' },
    { id: 'system', title: 'System Status', visible: true, order: 9, size: 'medium' },
  ],

  isLoading: false,
  isRefreshing: false,
  error: null,
  selectedWidgetId: null,
  
  filters: {
    dateRange: 'today', // 'today' | 'week' | 'month'
    department: 'all',
  },

  // Actions
  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().loadDashboardData();
  },

  setSelectedWidgetId: (selectedWidgetId) => set({ selectedWidgetId }),

  toggleWidgetVisibility: (widgetId) => {
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === widgetId ? { ...w, visible: !w.visible } : w
      ),
    }));
  },

  reorderWidgets: (orderedIds) => {
    set((state) => ({
      widgets: state.widgets.map((w) => {
        const index = orderedIds.indexOf(w.id);
        return index !== -1 ? { ...w, order: index } : w;
      }).sort((a, b) => a.order - b.order),
    }));
  },

  loadDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [summary, attendance, leave, employee, activities, health] = await Promise.all([
        dashboardService.getDashboardSummary(),
        dashboardService.getAttendanceSummary(),
        dashboardService.getLeaveSummary(),
        dashboardService.getEmployeeSummary(),
        dashboardService.getRecentActivities(),
        dashboardService.getSystemHealth(),
      ]);

      set({
        summary,
        attendanceSummary: attendance,
        leaveSummary: leave,
        employeeSummary: employee,
        recentActivities: activities,
        systemHealth: health,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.message || 'Failed to load dashboard data', isLoading: false });
    }
  },

  refreshDashboardData: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const [summary, attendance, leave, employee, activities, health] = await Promise.all([
        dashboardService.getDashboardSummary(),
        dashboardService.getAttendanceSummary(),
        dashboardService.getLeaveSummary(),
        dashboardService.getEmployeeSummary(),
        dashboardService.getRecentActivities(),
        dashboardService.getSystemHealth(),
      ]);

      set({
        summary,
        attendanceSummary: attendance,
        leaveSummary: leave,
        employeeSummary: employee,
        recentActivities: activities,
        systemHealth: health,
        isRefreshing: false,
      });
    } catch (err) {
      set({ error: err.message || 'Failed to refresh dashboard data', isRefreshing: false });
    }
  },
}));
