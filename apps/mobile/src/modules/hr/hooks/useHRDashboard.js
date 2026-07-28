import { useEffect } from 'react';
import { useHRDashboardStore } from '../store/hrDashboardStore';

export function useHRDashboard() {
  const summary = useHRDashboardStore((state) => state.summary);
  const widgets = useHRDashboardStore((state) => state.widgets);
  const isLoading = useHRDashboardStore((state) => state.isLoading);
  const isRefreshing = useHRDashboardStore((state) => state.isRefreshing);
  const error = useHRDashboardStore((state) => state.error);
  const filters = useHRDashboardStore((state) => state.filters);
  const setFilters = useHRDashboardStore((state) => state.setFilters);
  const toggleWidgetVisibility = useHRDashboardStore((state) => state.toggleWidgetVisibility);
  const loadDashboardData = useHRDashboardStore((state) => state.loadDashboardData);
  const refreshDashboardData = useHRDashboardStore((state) => state.refreshDashboardData);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    summary,
    widgets,
    isLoading,
    isRefreshing,
    error,
    filters,
    setFilters,
    toggleWidgetVisibility,
    refresh: refreshDashboardData,
  };
}
