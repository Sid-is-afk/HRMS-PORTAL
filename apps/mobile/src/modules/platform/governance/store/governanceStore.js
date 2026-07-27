import { create } from 'zustand';

export const useGovernanceStore = create((set) => ({
  dashboardSummary: null,
  features: [],
  modules: [],
  subscriptions: [],
  
  isLoading: false,
  error: null,

  setDashboardSummary: (summary) => set({ dashboardSummary: summary }),
  setFeatures: (features) => set({ features }),
  setModules: (modules) => set({ modules }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
