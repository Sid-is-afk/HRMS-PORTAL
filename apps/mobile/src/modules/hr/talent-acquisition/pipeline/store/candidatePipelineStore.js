import { create } from 'zustand';
import { pipelineService } from '../services/pipelineService';

export const useCandidatePipelineStore = create((set, get) => ({
  candidates: [],
  pipeline: [],
  selectedCandidate: null,
  dashboard: null,
  
  filters: {
    stage: 'all',
    status: 'all',
    experienceMin: '',
    skill: '',
    search: '',
  },

  isLoading: false,
  isRefreshing: false,
  error: null,

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().loadCandidates();
  },

  resetFilters: () => {
    set({
      filters: {
        stage: 'all',
        status: 'all',
        experienceMin: '',
        skill: '',
        search: '',
      }
    });
    get().loadCandidates();
  },

  loadCandidates: async () => {
    set({ isLoading: true, error: null });
    try {
      const candidates = await pipelineService.getCandidates(get().filters);
      set({ candidates, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load candidates', isLoading: false });
    }
  },

  loadCandidate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const candidate = await pipelineService.getCandidate(id);
      set({ selectedCandidate: candidate, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load candidate details', isLoading: false });
    }
  },

  createCandidate: async (candidateData) => {
    set({ isLoading: true, error: null });
    try {
      const newCand = await pipelineService.createCandidate(candidateData);
      set((state) => ({
        candidates: [newCand, ...state.candidates],
        isLoading: false,
      }));
      return newCand;
    } catch (err) {
      set({ error: err.message || 'Failed to create candidate', isLoading: false });
      throw err;
    }
  },

  loadPipeline: async () => {
    set({ isLoading: true, error: null });
    try {
      const pipeline = await pipelineService.getPipeline();
      set({ pipeline, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load pipeline board', isLoading: false });
    }
  },

  loadInterviewDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const dashboard = await pipelineService.getInterviewDashboard();
      set({ dashboard, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load interview dashboard', isLoading: false });
    }
  },

  refreshInterviewDashboard: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const dashboard = await pipelineService.getInterviewDashboard();
      set({ dashboard, isRefreshing: false });
    } catch (err) {
      set({ error: err.message || 'Failed to refresh dashboard', isRefreshing: false });
    }
  },

  updateCandidateStage: async (id, stage) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await pipelineService.updateCandidateStage(id, stage);
      set((state) => ({
        candidates: state.candidates.map(c => c.id === id ? updated : c),
        selectedCandidate: state.selectedCandidate && state.selectedCandidate.id === id 
          ? { ...state.selectedCandidate, ...updated } 
          : state.selectedCandidate,
        isLoading: false,
      }));
      await get().loadPipeline(); // Reload board
      await get().loadInterviewDashboard(); // Reload counts
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to update candidate stage', isLoading: false });
      throw err;
    }
  },

  scheduleInterview: async (candidateId, interviewData) => {
    set({ isLoading: true, error: null });
    try {
      const interview = await pipelineService.scheduleInterview(candidateId, interviewData);
      set({ isLoading: false });
      // Refresh candidate details if it's the selected one
      if (get().selectedCandidate && get().selectedCandidate.id === candidateId) {
        await get().loadCandidate(candidateId);
      }
      await get().loadInterviewDashboard();
      return interview;
    } catch (err) {
      set({ error: err.message || 'Failed to schedule interview', isLoading: false });
      throw err;
    }
  },

  rescheduleInterview: async (interviewId, newTimeData, candidateId) => {
    set({ isLoading: true, error: null });
    try {
      const interview = await pipelineService.rescheduleInterview(interviewId, newTimeData);
      set({ isLoading: false });
      if (candidateId) {
        await get().loadCandidate(candidateId);
      }
      await get().loadInterviewDashboard();
      return interview;
    } catch (err) {
      set({ error: err.message || 'Failed to reschedule interview', isLoading: false });
      throw err;
    }
  },

  cancelInterview: async (interviewId, candidateId) => {
    set({ isLoading: true, error: null });
    try {
      const interview = await pipelineService.cancelInterview(interviewId);
      set({ isLoading: false });
      if (candidateId) {
        await get().loadCandidate(candidateId);
      }
      await get().loadInterviewDashboard();
      return interview;
    } catch (err) {
      set({ error: err.message || 'Failed to cancel interview', isLoading: false });
      throw err;
    }
  },

  submitFeedback: async (interviewId, feedbackData, candidateId) => {
    set({ isLoading: true, error: null });
    try {
      const feedback = await pipelineService.submitInterviewFeedback(interviewId, feedbackData);
      set({ isLoading: false });
      if (candidateId) {
        await get().loadCandidate(candidateId);
      }
      await get().loadInterviewDashboard();
      return feedback;
    } catch (err) {
      set({ error: err.message || 'Failed to submit feedback', isLoading: false });
      throw err;
    }
  },

  addNote: async (candidateId, noteText) => {
    set({ isLoading: true, error: null });
    try {
      const note = await pipelineService.addCandidateNote(candidateId, noteText);
      set({ isLoading: false });
      // Reload candidate info to get updated notes feed
      await get().loadCandidate(candidateId);
      return note;
    } catch (err) {
      set({ error: err.message || 'Failed to add recruiter note', isLoading: false });
      throw err;
    }
  }
}));
