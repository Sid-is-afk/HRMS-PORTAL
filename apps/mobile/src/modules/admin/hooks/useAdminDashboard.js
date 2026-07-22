import { useEffect } from 'react';
import { useAdminDashboardStore } from '../store/adminDashboardStore';

export function useAdminDashboard() {
  const {
    isLoading,
    isRefreshing,
    error,
    filters,
    setFilters,
    loadDashboardData,
    refreshDashboardData,
  } = useAdminDashboardStore((state) => ({
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    filters: state.filters,
    setFilters: state.setFilters,
    loadDashboardData: state.loadDashboardData,
    refreshDashboardData: state.refreshDashboardData,
  }));

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    isLoading,
    isRefreshing,
    error,
    filters,
    setFilters,
    refresh: refreshDashboardData,
  };
}
