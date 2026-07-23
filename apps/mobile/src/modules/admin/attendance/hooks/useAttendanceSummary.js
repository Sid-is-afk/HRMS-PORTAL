import { useEffect } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';

export const useAttendanceSummary = (employeeId, period) => {
  const { attendanceSummary, isLoading, error, fetchAttendanceSummary } = useAttendanceStore();

  useEffect(() => {
    if (employeeId && period) {
      fetchAttendanceSummary(employeeId, period);
    }
  }, [employeeId, period]);

  return { attendanceSummary, isLoading, error, fetchAttendanceSummary };
};
