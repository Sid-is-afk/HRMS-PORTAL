import { useEffect } from 'react';
import { useLeaveStore } from '@/modules/employee/leave/store/leaveStore';

export function useLeaveHistory() {
  const { history, isLoading, isRefreshing, error, fetchLeaveHistory, refreshLeaveData } = useLeaveStore();

  useEffect(() => {
    fetchLeaveHistory(false);
  }, [fetchLeaveHistory]);

  return {
    history,
    isLoading,
    isRefreshing,
    error,
    refreshHistory: () => fetchLeaveHistory(true),
    refreshLeaveData,
  };
}
