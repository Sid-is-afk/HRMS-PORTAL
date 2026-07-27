import { useHRDashboardStore } from '../store/hrDashboardStore';

export function useHRQuickActions() {
  const { quickActions, isLoading, error } = useHRDashboardStore((state) => ({
    quickActions: state.quickActions,
    isLoading: state.isLoading,
    error: state.error,
  }));

  return {
    quickActions,
    isLoading,
    error,
  };
}
