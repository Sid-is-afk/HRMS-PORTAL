import { create } from 'zustand';

export const useOperationsStore = create((set) => ({
  dashboardSummary: null,
  services: [],
  incidents: [],
  logs: [],
  
  isLoading: false,
  error: null,

  setDashboardSummary: (summary) => set({ dashboardSummary: summary }),
  setServices: (services) => set({ services }),
  setIncidents: (incidents) => set({ incidents }),
  setLogs: (logs) => set({ logs }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
