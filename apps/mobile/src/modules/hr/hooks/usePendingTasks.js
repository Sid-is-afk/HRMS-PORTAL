import { useHRDashboardStore } from '../store/hrDashboardStore';
import { useShallow } from 'zustand/react/shallow';

export function usePendingTasks() {
  const { tasks, isLoading, error } = useHRDashboardStore(useShallow((state) => ({
    tasks: state.tasks,
    isLoading: state.isLoading,
    error: state.error,
  })));

  return {
    tasks,
    isLoading,
    error,
  };
}
