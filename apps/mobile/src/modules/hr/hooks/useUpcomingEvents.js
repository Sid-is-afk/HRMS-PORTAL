import { useHRDashboardStore } from '../store/hrDashboardStore';
import { useShallow } from 'zustand/react/shallow';

export function useUpcomingEvents() {
  const { events, isLoading, error } = useHRDashboardStore(useShallow((state) => ({
    events: state.events,
    isLoading: state.isLoading,
    error: state.error,
  })));

  return {
    events,
    isLoading,
    error,
  };
}
