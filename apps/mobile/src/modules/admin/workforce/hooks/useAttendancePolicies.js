import { useEffect } from 'react';
import { useWorkforceStore } from '../store/workforceStore';

export const useAttendancePolicies = () => {
  const { attendancePolicies, isLoading, error, fetchAttendancePolicies } = useWorkforceStore();

  useEffect(() => {
    fetchAttendancePolicies();
  }, []);

  return { attendancePolicies, isLoading, error, fetchAttendancePolicies };
};
