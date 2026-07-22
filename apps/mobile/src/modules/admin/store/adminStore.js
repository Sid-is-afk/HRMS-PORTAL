import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),
}));
