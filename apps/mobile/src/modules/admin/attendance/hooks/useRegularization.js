import { useAttendanceStore } from '../store/attendanceStore';

export const useRegularization = () => {
  const { submitRegularization, isLoading, error } = useAttendanceStore();

  return { submitRegularization, isLoading, error };
};
