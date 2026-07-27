import { useEffect } from 'react';
import { useHRDashboardStore } from '../store/hrDashboardStore';

export function useHRDashboard() {
  const {
    summary,
    widgets,
    isLoading,
    isRefreshing,
    error,
    filters,
    setFilters,
    toggleWidgetVisibility,
    loadDashboardData,
    refreshDashboardData,
  } = useHRDashboardStore((state) => ({
    summary: state.summary,
    widgets: state.widgets,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    filters: state.filters,
    setFilters: state.setFilters,
    toggleWidgetVisibility: state.toggleWidgetVisibility,
    loadDashboardData: state.loadDashboardData,
    refreshDashboardData: state.refreshDashboardData,
  }));

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
