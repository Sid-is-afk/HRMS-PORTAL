import { useHRDashboardStore } from '../store/hrDashboardStore';
import { useShallow } from 'zustand/react/shallow';

export function useHRQuickActions() {
  const { quickActions, isLoading, error } = useHRDashboardStore(useShallow((state) => ({
    quickActions: state.quickActions,
    isLoading: state.isLoading,
    error: state.error,
  })));

  return {
    quickActions,
    isLoading,
    error,
  };
}
