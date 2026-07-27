import { useHRDashboardStore } from '../store/hrDashboardStore';

export function useUpcomingEvents() {
  const { events, isLoading, error } = useHRDashboardStore((state) => ({
    events: state.events,
    isLoading: state.isLoading,
    error: state.error,
  }));

  return {
    events,
    isLoading,
    error,
  };
}
