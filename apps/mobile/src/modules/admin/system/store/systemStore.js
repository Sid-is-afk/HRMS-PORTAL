import { create } from 'zustand';
import { systemService } from '../services/systemService';

export const useSystemStore = create((set) => ({
  healthMetrics: [],
  settings: [],
  featureFlags: [],
  auditLogs: [],
  activityLogs: [],
  isLoading: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),

  fetchSystemHealth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await systemService.getSystemHealth();
      set({ healthMetrics: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await systemService.getApplicationSettings();
      set({ settings: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchFeatureFlags: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await systemService.getFeatureFlags();
      set({ featureFlags: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  toggleFeatureFlag: async (id, currentStatus) => {
    set({ isLoading: true, error: null });
    try {
      await systemService.updateFeatureFlag(id, !currentStatus);
      const response = await systemService.getFeatureFlags();
      set({ featureFlags: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAuditLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await systemService.getAuditLogs();
      set({ auditLogs: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchActivityLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await systemService.getActivityLogs();
      set({ activityLogs: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
