import { useEffect } from 'react';
import { useWorkforceStore } from '../store/workforceStore';

export const useShifts = () => {
  const { shifts, isLoading, error, fetchShifts, createShift } = useWorkforceStore();

  useEffect(() => {
    fetchShifts();
  }, []);

  return { shifts, isLoading, error, fetchShifts, createShift };
};
