import { useHRDashboardStore } from '../store/hrDashboardStore';

export function useRecentActivities() {
  const { activities, isLoading, error } = useHRDashboardStore((state) => ({
    activities: state.activities,
    isLoading: state.isLoading,
    error: state.error,
  }));

  return {
    activities,
    isLoading,
    error,
  };
}
