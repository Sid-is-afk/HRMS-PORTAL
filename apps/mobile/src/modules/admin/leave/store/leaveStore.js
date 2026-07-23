import { create } from 'zustand';
import { leaveService } from '../services/leaveService';

export const useLeaveStore = create((set) => ({
  leaveRequests: [],
  leaveBalances: [],
  leavePolicies: [],
  leaveCalendar: [],
  filters: {},
  searchQuery: '',
  isLoading: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setFilters: (filters) => set({ filters }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  fetchLeaveRequests: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await leaveService.getLeaveRequests(filters);
      set({ leaveRequests: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchLeaveBalances: async (employeeId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await leaveService.getLeaveBalances(employeeId);
      set({ leaveBalances: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchLeavePolicies: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await leaveService.getLeavePolicies();
      set({ leavePolicies: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchLeaveCalendar: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await leaveService.getLeaveCalendar(startDate, endDate);
      set({ leaveCalendar: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  submitLeaveRequest: async (leaveData) => {
    set({ isLoading: true, error: null });
    try {
      await leaveService.submitLeaveRequest(leaveData);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  approveLeave: async (leaveId, comments) => {
    set({ isLoading: true, error: null });
    try {
      await leaveService.approveLeave(leaveId, comments);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  rejectLeave: async (leaveId, comments) => {
    set({ isLoading: true, error: null });
    try {
      await leaveService.rejectLeave(leaveId, comments);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
