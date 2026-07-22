import { useEffect } from 'react';
import { useWorkforceStore } from '../store/workforceStore';

export const useHolidayCalendar = () => {
  const { holidayCalendars, isLoading, error, fetchHolidayCalendars } = useWorkforceStore();

  useEffect(() => {
    fetchHolidayCalendars();
  }, []);

  return { holidayCalendars, isLoading, error, fetchHolidayCalendars };
};
