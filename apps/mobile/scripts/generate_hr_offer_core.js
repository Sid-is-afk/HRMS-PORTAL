const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'talent-acquisition', 'offers');

const files = {
  'models/offerModels.js': `/**
 * @typedef {Object} CompensationSummary
 * @property {number} base_salary
 * @property {number} bonus
 * @property {number} equity
 * @property {string} currency
 */

/**
 * @typedef {Object} Offer
 * @property {string} id
 * @property {string} candidate_id
 * @property {string} candidate_name
 * @property {string} requisition_id
 * @property {string} job_title
 * @property {string} department
 * @property {string} location
 * @property {string} employment_type
 * @property {CompensationSummary} compensation
 * @property {string} joining_date
 * @property {string} reporting_manager
 * @property {number} validity_days
 * @property {string} status - Draft, Pending Approval, Approved, Sent, Accepted, Declined, Expired, Withdrawn
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} HiringDecision
 * @property {string} id
 * @property {string} candidate_id
 * @property {string} requisition_id
 * @property {string} decision - Approve, Reject, Hold, Escalate
 * @property {string} notes
 * @property {string} decided_by
 * @property {string} decided_at
 */

/**
 * @typedef {Object} OfferActivity
 * @property {string} id
 * @property {string} offer_id
 * @property {string} action
 * @property {string} actor
 * @property {string} timestamp
 */
`,

  'validation/offerSchema.js': `import { z } from 'zod';

export const compensationSchema = z.object({
  base_salary: z.number().positive(),
  bonus: z.number().min(0),
  equity: z.number().min(0),
  currency: z.string().min(3).max(3),
});

export const offerSchema = z.object({
  candidate_id: z.string().min(1, "Candidate is required"),
  requisition_id: z.string().min(1, "Job Requisition is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  employment_type: z.string().min(1, "Employment Type is required"),
  compensation: compensationSchema,
  joining_date: z.string().min(1, "Joining Date is required"),
  reporting_manager: z.string().min(1, "Reporting Manager is required"),
  validity_days: z.number().min(1).max(90),
});

export const hiringDecisionSchema = z.object({
  candidate_id: z.string().min(1),
  requisition_id: z.string().min(1),
  decision: z.enum(['Approve', 'Reject', 'Hold', 'Escalate']),
  notes: z.string().optional(),
});
`,

  'store/offerStore.js': `import { create } from 'zustand';

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
`,

  'services/offerService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockOffers = [
  {
    id: 'OFF-001',
    candidate_id: 'CAN-123',
    candidate_name: 'Alice Johnson',
    requisition_id: 'REQ-055',
    job_title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    employment_type: 'Full-Time',
    compensation: { base_salary: 150000, bonus: 15000, equity: 5000, currency: 'USD' },
    joining_date: '2026-09-01',
    reporting_manager: 'Bob Smith',
    validity_days: 7,
    status: 'Pending Approval',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const offerService = {
  getOffers: async () => {
    await delay();
    return mockOffers;
  },
  
  createOffer: async (offerData) => {
    await delay();
    return {
      id: \`OFF-\${Math.floor(Math.random() * 1000)}\`,
      status: 'Draft',
      created_at: new Date().toISOString(),
      ...offerData
    };
  },

  updateOfferStatus: async (offerId, newStatus) => {
    await delay();
    return { id: offerId, status: newStatus, updated_at: new Date().toISOString() };
  },

  submitHiringDecision: async (decisionData) => {
    await delay();
    return {
      id: \`DEC-\${Math.floor(Math.random() * 1000)}\`,
      decided_by: 'Current User',
      decided_at: new Date().toISOString(),
      ...decisionData
    };
  }
};
`,

  'hooks/useOffers.js': `import { useEffect } from 'react';
import { useOfferStore } from '../store/offerStore';
import { offerService } from '../services/offerService';

export function useOffers() {
  const { offers, isLoading, error, setOffers, setLoading, setError, searchQuery, filterStatus } = useOfferStore();

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await offerService.getOffers();
      setOffers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          offer.job_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return { offers: filteredOffers, isLoading, error, fetchOffers, allOffers: offers };
}
`,

  'hooks/useOfferActions.js': `import { useOfferStore } from '../store/offerStore';
import { offerService } from '../services/offerService';

export function useOfferActions() {
  const { addOffer, updateOffer, addHiringDecision, setLoading, setError } = useOfferStore();

  const createOffer = async (data) => {
    try {
      setLoading(true);
      const newOffer = await offerService.createOffer(data);
      addOffer(newOffer);
      return newOffer;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeOfferStatus = async (offerId, status) => {
    try {
      setLoading(true);
      const updated = await offerService.updateOfferStatus(offerId, status);
      updateOffer(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const makeHiringDecision = async (decisionData) => {
    try {
      setLoading(true);
      const decision = await offerService.submitHiringDecision(decisionData);
      addHiringDecision(decision);
      return decision;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOffer, changeOfferStatus, makeHiringDecision };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Offer core files created successfully.');
