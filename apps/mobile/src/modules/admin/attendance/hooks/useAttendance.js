import { useEffect } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';

export const useAttendance = (filters = {}) => {
  const { attendanceRecords, isLoading, error, fetchAttendance } = useAttendanceStore();

  useEffect(() => {
    fetchAttendance(filters);
  }, [JSON.stringify(filters)]);

  return { attendanceRecords, isLoading, error, fetchAttendance };
};
