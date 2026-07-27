import { useEffect } from 'react';
import { useAdminDashboardStore } from '../store/adminDashboardStore';

export function useAdminDashboard() {
  const isLoading = useAdminDashboardStore((state) => state.isLoading);
  const isRefreshing = useAdminDashboardStore((state) => state.isRefreshing);
  const error = useAdminDashboardStore((state) => state.error);
  const filters = useAdminDashboardStore((state) => state.filters);
  const setFilters = useAdminDashboardStore((state) => state.setFilters);
  const loadDashboardData = useAdminDashboardStore((state) => state.loadDashboardData);
  const refreshDashboardData = useAdminDashboardStore((state) => state.refreshDashboardData);

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
