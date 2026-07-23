import { useLeaveStore } from '../store/leaveStore';

export const useLeaveApprovals = () => {
  const { approveLeave, rejectLeave, isLoading, error } = useLeaveStore();

  return { approveLeave, rejectLeave, isLoading, error };
};
