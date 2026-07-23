import { useEffect } from 'react';
import { useLeaveStore } from '../store/leaveStore';

export const useLeave = (filters = {}) => {
  const { leaveRequests, isLoading, error, fetchLeaveRequests } = useLeaveStore();

  useEffect(() => {
    fetchLeaveRequests(filters);
  }, [JSON.stringify(filters)]);

  return { leaveRequests, isLoading, error, fetchLeaveRequests };
};
