import { create } from 'zustand';
import { communicationService } from '../services/communicationService';

export const useCommunicationStore = create((set) => ({
  announcements: [],
  templates: [],
  drafts: [],
  audiencePreview: null,
  filters: {},
  searchQuery: '',
  isLoading: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setFilters: (filters) => set({ filters }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  fetchAnnouncements: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await communicationService.getAnnouncements(filters);
      set({ announcements: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await communicationService.getTemplates();
      set({ templates: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAudiencePreview: async (audienceFilter) => {
    set({ isLoading: true, error: null });
    try {
      const response = await communicationService.getAudiencePreview(audienceFilter);
      set({ audiencePreview: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createAnnouncement: async (announcementData) => {
    set({ isLoading: true, error: null });
    try {
      await communicationService.createAnnouncement(announcementData);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  publishAnnouncement: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await communicationService.publishAnnouncement(id);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  archiveAnnouncement: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await communicationService.archiveAnnouncement(id);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));
