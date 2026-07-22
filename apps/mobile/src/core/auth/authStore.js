import { create } from 'zustand';
import { saveToken, saveUser, logout as storageLogout } from '@/core/storage/authStorage';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  setTokens: (accessToken, refreshToken) => {
    saveToken(accessToken, refreshToken);
    set({ accessToken, refreshToken, error: null });
  },

  setUser: (user) => {
    saveUser(user);
    set({ user, error: null });
  },

  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),

  logoutAction: () => {
    storageLogout();
    set({ user: null, accessToken: null, refreshToken: null, error: null });
  },
  
  // Method to hydrate state from storage on app load
  hydrate: (accessToken, refreshToken, user) => {
    set({ accessToken, refreshToken, user, isLoading: false, error: null });
  }
}));
