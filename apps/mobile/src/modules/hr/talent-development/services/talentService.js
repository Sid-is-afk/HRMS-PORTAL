const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockGoals = [
  { id: 'GOAL-1', employee_id: 'EMP-001', title: 'Q3 Revenue Target', description: 'Achieve $1M in sales', progress_percentage: 45, status: 'In Progress', due_date: '2026-09-30' },
  { id: 'GOAL-2', employee_id: 'EMP-001', title: 'Technical Cert', description: 'Complete AWS Solutions Architect', progress_percentage: 10, status: 'At Risk', due_date: '2026-08-15' }
];

const mockCourses = [
  { id: 'CRS-1', title: 'Leadership 101', category: 'Soft Skills', duration_minutes: 120, is_mandatory: false, status: 'Not Started', completion_percentage: 0 },
  { id: 'CRS-2', title: 'Data Privacy 2026', category: 'Compliance', duration_minutes: 45, is_mandatory: true, status: 'Completed', completion_percentage: 100 }
];

const mockCompliance = [
  { id: 'COMP-1', requirement_name: 'Code of Conduct', status: 'Compliant', expiry_date: '2027-01-01' },
  { id: 'COMP-2', requirement_name: 'Information Security', status: 'Expiring Soon', expiry_date: '2026-08-01' }
];

export const talentService = {
  getGoals: async () => {
    await delay();
    return mockGoals;
  },
  
  getLearningCatalog: async () => {
    await delay();
    return mockCourses;
  },

  getComplianceStatus: async () => {
    await delay();
    return mockCompliance;
  }
};
