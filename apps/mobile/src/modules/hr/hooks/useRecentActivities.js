import { useHRDashboardStore } from '../store/hrDashboardStore';

export function useRecentActivities() {
  const activities = useHRDashboardStore((state) => state.activities);
  const isLoading = useHRDashboardStore((state) => state.isLoading);
  const error = useHRDashboardStore((state) => state.error);

  return {
    activities,
    isLoading,
    error,
  };
}
