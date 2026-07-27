import { create } from 'zustand';

export const useOperationsStore = create((set) => ({
  serviceRequests: [],
  cases: [],
  automationRules: [],
  reminders: [],
  approvals: [],
  isLoading: false,
  error: null,

  setServiceRequests: (requests) => set({ serviceRequests: requests }),
  setCases: (cases) => set({ cases }),
  setAutomationRules: (rules) => set({ automationRules: rules }),
  setReminders: (reminders) => set({ reminders }),
  setApprovals: (approvals) => set({ approvals }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
