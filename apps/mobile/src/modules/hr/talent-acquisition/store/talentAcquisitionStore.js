import { create } from 'zustand';
import { talentService } from '../services/talentService';

export const useTalentAcquisitionStore = create((set, get) => ({
  summary: null,
  jobRequisitions: [],
  jobPostings: [],
  activities: [],

  filters: {
    departmentId: 'all',
    hiringManagerId: 'all',
    employmentType: 'all',
    priority: 'all',
    status: 'all',
    search: '',
  },

  selectedRequisitionId: null,
  selectedPostingId: null,
  isLoading: false,
  isRefreshing: false,
  error: null,

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().loadRequisitions();
    get().loadPostings();
  },

  resetFilters: () => {
    set({
      filters: {
        departmentId: 'all',
        hiringManagerId: 'all',
        employmentType: 'all',
        priority: 'all',
        status: 'all',
        search: '',
      }
    });
    get().loadRequisitions();
    get().loadPostings();
  },

  setSelectedRequisitionId: (id) => set({ selectedRequisitionId: id }),
  setSelectedPostingId: (id) => set({ selectedPostingId: id }),

  loadDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [summary, requisitions, postings, activities] = await Promise.all([
        talentService.getTalentDashboard(),
        talentService.getJobRequisitions(get().filters),
        talentService.getJobPostings(get().filters),
        talentService.getHiringActivities(),
      ]);

      set({
        summary,
        jobRequisitions: requisitions,
        jobPostings: postings,
        activities,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.message || 'Failed to load recruitment dashboard data', isLoading: false });
    }
  },

  refreshDashboardData: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const [summary, requisitions, postings, activities] = await Promise.all([
        talentService.getTalentDashboard(),
        talentService.getJobRequisitions(get().filters),
        talentService.getJobPostings(get().filters),
        talentService.getHiringActivities(),
      ]);

      set({
        summary,
        jobRequisitions: requisitions,
        jobPostings: postings,
        activities,
        isRefreshing: false,
      });
    } catch (err) {
      set({ error: err.message || 'Failed to refresh recruitment dashboard data', isRefreshing: false });
    }
  },

  loadRequisitions: async () => {
    try {
      const requisitions = await talentService.getJobRequisitions(get().filters);
      set({ jobRequisitions: requisitions });
    } catch (err) {
      set({ error: err.message || 'Failed to load Job Requisitions' });
    }
  },

  loadPostings: async () => {
    try {
      const postings = await talentService.getJobPostings(get().filters);
      set({ jobPostings: postings });
    } catch (err) {
      set({ error: err.message || 'Failed to load Job Postings' });
    }
  },

  createRequisition: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newReq = await talentService.createJobRequisition(data);
      set((state) => ({
        jobRequisitions: [newReq, ...state.jobRequisitions],
        isLoading: false,
      }));
      get().loadDashboardData(); // Refresh summary metrics
      return newReq;
    } catch (err) {
      set({ error: err.message || 'Failed to create Job Requisition', isLoading: false });
      throw err;
    }
  },

  updateRequisition: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await talentService.updateJobRequisition(id, data);
      set((state) => ({
        jobRequisitions: state.jobRequisitions.map(r => r.id === id ? updated : r),
        isLoading: false,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to update Job Requisition', isLoading: false });
      throw err;
    }
  },

  publishPosting: async (requisitionId, data) => {
    set({ isLoading: true, error: null });
    try {
      const newPost = await talentService.publishJobPosting(requisitionId, data);
      set((state) => ({
        jobPostings: [newPost, ...state.jobPostings],
        isLoading: false,
      }));
      get().loadDashboardData(); // Refresh counts
      return newPost;
    } catch (err) {
      set({ error: err.message || 'Failed to publish job posting', isLoading: false });
      throw err;
    }
  },

  archivePosting: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await talentService.archiveJobPosting(id);
      set((state) => ({
        jobPostings: state.jobPostings.map(p => p.id === id ? updated : p),
        isLoading: false,
      }));
      get().loadDashboardData(); // Refresh stats
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to archive job posting', isLoading: false });
      throw err;
    }
  },
}));
