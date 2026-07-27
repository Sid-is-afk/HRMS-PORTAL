import { create } from 'zustand';

export const useOfferStore = create((set) => ({
  offers: [],
  activities: [],
  hiringDecisions: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  filterStatus: 'all',

  setOffers: (offers) => set({ offers }),
  setActivities: (activities) => set({ activities }),
  setHiringDecisions: (decisions) => set({ hiringDecisions: decisions }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),

  addOffer: (offer) => set((state) => ({ offers: [offer, ...state.offers] })),
  updateOffer: (updatedOffer) => set((state) => ({
    offers: state.offers.map((o) => o.id === updatedOffer.id ? updatedOffer : o)
  })),
  addHiringDecision: (decision) => set((state) => ({
    hiringDecisions: [decision, ...state.hiringDecisions]
  })),
}));
