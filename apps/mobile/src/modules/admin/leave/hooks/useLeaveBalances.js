import { useEffect } from 'react';
import { useLeaveStore } from '../store/leaveStore';

export const useLeaveBalances = (employeeId) => {
  const { leaveBalances, isLoading, error, fetchLeaveBalances } = useLeaveStore();

  useEffect(() => {
    if (employeeId) {
      fetchLeaveBalances(employeeId);
    }
  }, [employeeId]);

  return { leaveBalances, isLoading, error, fetchLeaveBalances };
};
