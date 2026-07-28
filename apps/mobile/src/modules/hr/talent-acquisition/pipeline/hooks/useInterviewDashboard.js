import { useEffect } from 'react';
import { useCandidatePipelineStore } from '../store/candidatePipelineStore';
import { useShallow } from 'zustand/react/shallow';

export function useInterviewDashboard() {
  const {
    dashboard,
    isLoading,
    isRefreshing,
    error,
    loadInterviewDashboard,
    refreshInterviewDashboard,
  } = useCandidatePipelineStore(useShallow((state) => ({
    dashboard: state.dashboard,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    loadInterviewDashboard: state.loadInterviewDashboard,
    refreshInterviewDashboard: state.refreshInterviewDashboard,
  })));

  useEffect(() => {
    loadInterviewDashboard();
  }, [loadInterviewDashboard]);

  return {
    dashboard,
    isLoading,
    isRefreshing,
    error,
    refresh: refreshInterviewDashboard,
  };
}
