import { create } from 'zustand';
import { workforceService } from '../services/workforceService';

export const useWorkforceStore = create((set) => ({
  shifts: [],
  holidayCalendars: [],
  attendancePolicies: [],
  weeklyOffDays: ['Saturday', 'Sunday'],
  workingHours: { standardDailyHours: 8, standardWeeklyHours: 40 },
  isLoading: false,
  error: null,
  filters: {},

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),

  fetchShifts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await workforceService.getShifts();
      set({ shifts: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createShift: async (shiftData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workforceService.createShift(shiftData);
      set(state => ({ 
        shifts: [...state.shifts, response.data],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchHolidayCalendars: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await workforceService.getHolidayCalendars();
      set({ holidayCalendars: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAttendancePolicies: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await workforceService.getAttendancePolicies();
      set({ attendancePolicies: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
