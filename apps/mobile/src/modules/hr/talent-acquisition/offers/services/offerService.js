const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
      id: `OFF-${Math.floor(Math.random() * 1000)}`,
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
      id: `DEC-${Math.floor(Math.random() * 1000)}`,
      decided_by: 'Current User',
      decided_at: new Date().toISOString(),
      ...decisionData
    };
  }
};
