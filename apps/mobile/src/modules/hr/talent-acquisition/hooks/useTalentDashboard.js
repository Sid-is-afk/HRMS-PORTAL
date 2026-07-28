import { useEffect } from 'react';
import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';

export function useTalentDashboard() {
  const summary = useTalentAcquisitionStore((state) => state.summary);
  const isLoading = useTalentAcquisitionStore((state) => state.isLoading);
  const isRefreshing = useTalentAcquisitionStore((state) => state.isRefreshing);
  const error = useTalentAcquisitionStore((state) => state.error);
  const loadDashboardData = useTalentAcquisitionStore((state) => state.loadDashboardData);
  const refreshDashboardData = useTalentAcquisitionStore((state) => state.refreshDashboardData);

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
