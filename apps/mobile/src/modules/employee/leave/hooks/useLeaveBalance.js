import { useEffect } from 'react';
import { useLeaveStore } from '@/modules/employee/leave/store/leaveStore';

export function useLeaveBalance() {
  const { balance, isLoading, error, fetchLeaveBalance } = useLeaveStore();

  useEffect(() => {
    fetchLeaveBalance();
  }, [fetchLeaveBalance]);

  return {
    balance,
    isLoading,
    error,
    refreshBalance: fetchLeaveBalance,
  };
}
