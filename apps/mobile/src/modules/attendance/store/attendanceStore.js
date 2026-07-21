import { create } from 'zustand';
import { attendanceService } from '../services/attendanceService';

export const useAttendanceStore = create((set, get) => ({
  // State
  currentStatus: 'NOT_MARKED', // NOT_MARKED, CLOCKED_IN, CLOCKED_OUT
  todayRecord: {
    checkIn: null,
    checkOut: null,
    hoursWorked: 0,
  },
  history: [],
  summary: null,
  
  isLoading: false,
  isRefreshing: false,
  error: null,

  // Actions
  fetchTodayAttendance: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await attendanceService.getTodayAttendance();
      set({
        currentStatus: data.status,
        todayRecord: {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          hoursWorked: data.hoursWorked,
        },
        isLoading: false,
      });
    } catch (err) {
      set({ 
        error: err.message || 'Failed to fetch attendance',
        isLoading: false 
      });
    }
  },

  performCheckIn: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await attendanceService.checkIn();
      set({
        currentStatus: data.status,
        todayRecord: {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          hoursWorked: data.hoursWorked,
        },
        isLoading: false,
      });
    } catch (err) {
      set({ 
        error: err.message || 'Check-in failed. Please try again.',
        isLoading: false 
      });
    }
  },

  performCheckOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { todayRecord } = get();
      const data = await attendanceService.checkOut(todayRecord.checkIn);
      set({
        currentStatus: data.status,
        todayRecord: {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          hoursWorked: data.hoursWorked,
        },
        isLoading: false,
      });
    } catch (err) {
      set({ 
        error: err.message || 'Check-out failed. Please try again.',
        isLoading: false 
      });
    }
  },

  fetchHistory: async (refresh = false) => {
    if (refresh) {
      set({ isRefreshing: true, error: null });
    } else {
      set({ isLoading: true, error: null });
    }
    
    try {
      const data = await attendanceService.getAttendanceHistory();
      set({
        history: data.data,
        isLoading: false,
        isRefreshing: false,
      });
    } catch (err) {
      set({ 
        error: err.message || 'Failed to fetch history',
        isLoading: false,
        isRefreshing: false,
      });
    }
  },

  fetchSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await attendanceService.getAttendanceSummary();
      set({
        summary: data,
        isLoading: false,
      });
    } catch (err) {
      set({ 
        error: err.message || 'Failed to fetch summary',
        isLoading: false 
      });
    }
  },
}));
