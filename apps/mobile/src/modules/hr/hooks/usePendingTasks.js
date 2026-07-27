import { useHRDashboardStore } from '../store/hrDashboardStore';

export function usePendingTasks() {
  const { tasks, isLoading, error } = useHRDashboardStore((state) => ({
    tasks: state.tasks,
    isLoading: state.isLoading,
    error: state.error,
  }));

  return {
    tasks,
    isLoading,
    error,
  };
}
