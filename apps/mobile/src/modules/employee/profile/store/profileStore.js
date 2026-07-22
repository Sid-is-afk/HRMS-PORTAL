import { create } from 'zustand';
import { profileService } from '../services/profileService';

const initialState = {
  profile: null,
  employmentDetails: null,
  emergencyContacts: [],
  documents: [],
  accountInfo: null,
  isLoading: false,
  isRefreshing: false,
  isSubmitting: false,
  error: null,
};

export const useProfileStore = create((set, get) => ({
  ...initialState,

  clearError: () => set({ error: null }),

  fetchProfile: async (refresh = false) => {
    if (refresh) {
      set({ isRefreshing: true, error: null });
    } else {
      set({ isLoading: true, error: null });
    }

    try {
      const data = await profileService.getProfile();
      set({ profile: data, isLoading: false, isRefreshing: false });
      return data;
    } catch (error) {
      set({
        error: error.message || 'Unable to load profile right now.',
        isLoading: false,
        isRefreshing: false,
      });
      throw error;
    }
  },

  fetchEmploymentDetails: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await profileService.getEmploymentDetails();
      set({ employmentDetails: data, isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error.message || 'Unable to load employment details.',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchEmergencyContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await profileService.getEmergencyContacts();
      set({ emergencyContacts: data, isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error.message || 'Unable to load emergency contacts.',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await profileService.getDocuments();
      set({ documents: data, isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error.message || 'Unable to load documents.',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchAccountInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await profileService.getAccountInfo();
      set({ accountInfo: data, isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error.message || 'Unable to load account information.',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProfile: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const data = await profileService.updateProfile(payload);
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : data,
        isSubmitting: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.message || 'Profile update failed.',
        isSubmitting: false,
      });
      throw error;
    }
  },

  changePassword: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const data = await profileService.changePassword(payload);
      set({ isSubmitting: false });
      return data;
    } catch (error) {
      set({
        error: error.message || 'Password change failed.',
        isSubmitting: false,
      });
      throw error;
    }
  },

  uploadProfileImage: async () => {
    set({ isSubmitting: true, error: null });
    try {
      const data = await profileService.uploadProfileImage();
      set((state) => ({
        profile: state.profile ? { ...state.profile, avatarUrl: data.avatarUrl } : data,
        isSubmitting: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.message || 'Profile image upload failed.',
        isSubmitting: false,
      });
      throw error;
    }
  },

  refreshProfileData: async () => {
    await Promise.all([
      get().fetchProfile(true),
      get().fetchEmploymentDetails(),
      get().fetchEmergencyContacts(),
      get().fetchDocuments(),
      get().fetchAccountInfo(),
    ]);
  },
}));
