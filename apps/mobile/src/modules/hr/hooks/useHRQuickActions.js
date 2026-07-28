import { useHRDashboardStore } from '../store/hrDashboardStore';

export function useHRQuickActions() {
  const quickActions = useHRDashboardStore((state) => state.quickActions);
  const isLoading = useHRDashboardStore((state) => state.isLoading);
  const error = useHRDashboardStore((state) => state.error);

  return {
    quickActions,
    isLoading,
    error,
  };
}
