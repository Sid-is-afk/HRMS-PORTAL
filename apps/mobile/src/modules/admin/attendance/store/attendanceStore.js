import { create } from 'zustand';
import { attendanceService } from '../services/attendanceService';

export const useAttendanceStore = create((set) => ({
  attendanceRecords: [],
  attendanceSummary: null,
  attendanceExceptions: [],
  regularizationHistory: [],
  filters: {},
  searchQuery: '',
  isLoading: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setFilters: (filters) => set({ filters }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  fetchAttendance: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await attendanceService.getAttendance(filters);
      set({ attendanceRecords: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAttendanceSummary: async (employeeId, period) => {
    set({ isLoading: true, error: null });
    try {
      const response = await attendanceService.getAttendanceSummary(employeeId, period);
      set({ attendanceSummary: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAttendanceExceptions: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await attendanceService.getAttendanceExceptions(filters);
      set({ attendanceExceptions: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  submitRegularization: async (regularizationData) => {
    set({ isLoading: true, error: null });
    try {
      await attendanceService.submitRegularization(regularizationData);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
