import { useEffect } from 'react';
import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';

export function useTalentDashboard() {
  const {
    summary,
    isLoading,
    isRefreshing,
    error,
    loadDashboardData,
    refreshDashboardData,
  } = useTalentAcquisitionStore((state) => ({
    summary: state.summary,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    loadDashboardData: state.loadDashboardData,
    refreshDashboardData: state.refreshDashboardData,
  }));

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    summary,
    isLoading,
    isRefreshing,
    error,
    refresh: refreshDashboardData,
  };
}
