import { create } from 'zustand';
import { workflowService } from '../services/workflowService';

export const useWorkflowStore = create((set, get) => ({
  templates: [],
  queue: [],
  selectedRequest: null,

  isLoading: false,
  error: null,

  filters: { search: '', status: 'all' },

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().loadApprovalQueue();
  },

  loadTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const templates = await workflowService.getWorkflowTemplates();
      set({ templates, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load templates', isLoading: false });
    }
  },

  loadApprovalQueue: async () => {
    set({ isLoading: true, error: null });
    const { filters } = get();
    try {
      const list = await workflowService.getApprovalQueue(filters);
      set({ queue: list, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load approval queue', isLoading: false });
    }
  },

  loadRequestDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const details = await workflowService.getWorkflowDetails(id);
      set({ selectedRequest: details, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load request details', isLoading: false });
    }
  },

  approve: async (id, comment) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await workflowService.approveRequest(id, comment);
      set({ selectedRequest: updated, isLoading: false });
      get().loadApprovalQueue();
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to approve request', isLoading: false });
      throw err;
    }
  },

  reject: async (id, comment) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await workflowService.rejectRequest(id, comment);
      set({ selectedRequest: updated, isLoading: false });
      get().loadApprovalQueue();
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to reject request', isLoading: false });
      throw err;
    }
  },

  returnForChanges: async (id, comment) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await workflowService.returnRequest(id, comment);
      set({ selectedRequest: updated, isLoading: false });
      get().loadApprovalQueue();
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to return request', isLoading: false });
      throw err;
    }
  },

  addComment: async (id, commentText) => {
    set({ isLoading: true, error: null });
    try {
      const { selectedRequest } = get();
      if (!selectedRequest) return;

      const newComment = {
        id: `comment-${Math.random().toString(36).substr(2, 9)}`,
        authorName: 'HR Administrator',
        comment: commentText,
        timestamp: new Date().toISOString(),
      };

      const updated = {
        ...selectedRequest,
        comments: [...selectedRequest.comments, newComment],
      };

      set({ selectedRequest: updated, isLoading: false });
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to add comment', isLoading: false });
      throw err;
    }
  },
}));
