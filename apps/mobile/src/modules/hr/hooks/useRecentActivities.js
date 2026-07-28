import { useHRDashboardStore } from '../store/hrDashboardStore';
import { useShallow } from 'zustand/react/shallow';

export function useRecentActivities() {
  const { activities, isLoading, error } = useHRDashboardStore(useShallow((state) => ({
    activities: state.activities,
    isLoading: state.isLoading,
    error: state.error,
  })));

  return {
    activities,
    isLoading,
    error,
  };
}
