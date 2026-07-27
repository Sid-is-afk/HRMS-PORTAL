import { create } from 'zustand';

export const useIdentityStore = create((set) => ({
  dashboardSummary: null,
  platformUsers: [],
  globalRoles: [],
  sessions: [],
  
  isLoading: false,
  error: null,

  setDashboardSummary: (summary) => set({ dashboardSummary: summary }),
  setPlatformUsers: (users) => set({ platformUsers: users }),
  setGlobalRoles: (roles) => set({ globalRoles: roles }),
  setSessions: (sessions) => set({ sessions }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
