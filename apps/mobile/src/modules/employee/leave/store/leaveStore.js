import { create } from 'zustand';
import { leaveService } from '../services/leaveService';

const initialState = {
  balance: null,
  history: [],
  currentRequest: null,
  leaveTypes: [],
  isLoading: false,
  isRefreshing: false,
  isSubmitting: false,
  error: null,
};

export const useLeaveStore = create((set, get) => ({
  ...initialState,

  clearError: () => set({ error: null }),

  fetchLeaveBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await leaveService.getLeaveBalance();
      set({ balance: data, isLoading: false });
    } catch (error) {
      set({
        error: error.message || 'Unable to fetch leave balance right now.',
        isLoading: false,
      });
    }
  },

  fetchLeaveHistory: async (refresh = false) => {
    if (refresh) {
      set({ isRefreshing: true, error: null });
    } else {
      set({ isLoading: true, error: null });
    }

    try {
      const data = await leaveService.getLeaveHistory();
      set({
        history: data.data || [],
        isLoading: false,
        isRefreshing: false,
      });
    } catch (error) {
      set({
        error: error.message || 'Unable to load your leave history.',
        isLoading: false,
        isRefreshing: false,
      });
    }
  },

  fetchLeaveDetails: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await leaveService.getLeaveDetails(requestId);
      set({ currentRequest: data, isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error.message || 'Unable to load leave request details.',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchLeaveTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await leaveService.getLeaveTypes();
      set({ leaveTypes: data, isLoading: false });
    } catch (error) {
      set({
        error: error.message || 'Unable to load leave types.',
        isLoading: false,
      });
    }
  },

  applyLeave: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const request = await leaveService.applyLeave(payload);
      set((state) => ({
        currentRequest: request,
        history: [request, ...state.history],
        isSubmitting: false,
      }));
      return request;
    } catch (error) {
      set({
        error: error.message || 'Leave submission failed. Please try again.',
        isSubmitting: false,
      });
      throw error;
    }
  },

  cancelLeave: async (requestId) => {
    set({ isSubmitting: true, error: null });
    try {
      const updatedRequest = await leaveService.cancelLeave(requestId);
      set((state) => ({
        currentRequest: updatedRequest,
        history: state.history.map((item) =>
          item.id === requestId ? { ...item, status: updatedRequest.status } : item
        ),
        isSubmitting: false,
      }));
      return updatedRequest;
    } catch (error) {
      set({
        error: error.message || 'Unable to cancel this leave request.',
        isSubmitting: false,
      });
      throw error;
    }
  },

  refreshLeaveData: async () => {
    await Promise.all([get().fetchLeaveBalance(), get().fetchLeaveHistory(true)]);
  },
}));
