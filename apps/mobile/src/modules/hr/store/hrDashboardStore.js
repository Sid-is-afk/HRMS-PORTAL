import { create } from 'zustand';
import { hrDashboardService } from '../services/hrDashboardService';

export const useHRDashboardStore = create((set, get) => ({
  summary: null,
  activities: [],
  tasks: [],
  notifications: [],
  events: [],
  quickActions: [],

  // Widget visibility and configuration
  widgets: [
    { id: 'kpi', title: 'Recruitment & Staffing KPI', visible: true, order: 1, size: 'large' },
    { id: 'quickActions', title: 'Quick Actions', visible: true, order: 2, size: 'large' },
    { id: 'onboarding', title: 'Onboarding & Confirmations', visible: true, order: 3, size: 'medium' },
    { id: 'performance', title: 'Performance & Training', visible: true, order: 4, size: 'medium' },
    { id: 'tasks', title: 'Pending HR Tasks', visible: true, order: 5, size: 'medium' },
    { id: 'activities', title: 'Recent HR Activity', visible: true, order: 6, size: 'medium' },
    { id: 'events', title: 'Upcoming Events', visible: true, order: 7, size: 'medium' },
    { id: 'notifications', title: 'System Alerts & Notifications', visible: true, order: 8, size: 'medium' },
  ],

  isLoading: false,
  isRefreshing: false,
  error: null,
  selectedWidgetId: null,

  filters: {
    dateRange: 'today', // 'today' | 'week' | 'month'
    category: 'all', // 'all' | 'recruitment' | 'onboarding' | 'performance' | 'training' | 'documents'
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
      const [summary, tasks, events, activities, quickActions, notifications] = await Promise.all([
        hrDashboardService.getHRDashboard(),
        hrDashboardService.getPendingTasks(),
        hrDashboardService.getUpcomingEvents(),
        hrDashboardService.getRecentActivities(),
        hrDashboardService.getQuickActions(),
        hrDashboardService.getNotifications(),
      ]);

      set({
        summary,
        tasks,
        events,
        activities,
        quickActions,
        notifications,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.message || 'Failed to load HR dashboard data', isLoading: false });
    }
  },

  refreshDashboardData: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const [summary, tasks, events, activities, quickActions, notifications] = await Promise.all([
        hrDashboardService.getHRDashboard(),
        hrDashboardService.getPendingTasks(),
        hrDashboardService.getUpcomingEvents(),
        hrDashboardService.getRecentActivities(),
        hrDashboardService.getQuickActions(),
        hrDashboardService.getNotifications(),
      ]);

      set({
        summary,
        tasks,
        events,
        activities,
        quickActions,
        notifications,
        isRefreshing: false,
      });
    } catch (err) {
      set({ error: err.message || 'Failed to refresh HR dashboard data', isRefreshing: false });
    }
  },
}));
