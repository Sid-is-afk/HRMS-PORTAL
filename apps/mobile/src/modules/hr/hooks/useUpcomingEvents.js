import { useHRDashboardStore } from '../store/hrDashboardStore';

export function useUpcomingEvents() {
  const events = useHRDashboardStore((state) => state.events);
  const isLoading = useHRDashboardStore((state) => state.isLoading);
  const error = useHRDashboardStore((state) => state.error);

  return {
    events,
    isLoading,
    error,
  };
}
