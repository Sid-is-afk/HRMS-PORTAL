import { useHRDashboardStore } from '../store/hrDashboardStore';

export function usePendingTasks() {
  const tasks = useHRDashboardStore((state) => state.tasks);
  const isLoading = useHRDashboardStore((state) => state.isLoading);
  const error = useHRDashboardStore((state) => state.error);

  return {
    tasks,
    isLoading,
    error,
  };
}
