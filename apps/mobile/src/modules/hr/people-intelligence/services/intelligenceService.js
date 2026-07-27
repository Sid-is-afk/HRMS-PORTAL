const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockKpis = [
  { id: 'KPI-1', title: 'Total Headcount', value: '1,245', trend: 'up', percentage: '+5.2%' },
  { id: 'KPI-2', title: 'Retention Rate', value: '92.4%', trend: 'up', percentage: '+1.1%' },
  { id: 'KPI-3', title: 'Time to Hire', value: '24 Days', trend: 'down', percentage: '-3.5%' },
  { id: 'KPI-4', title: 'Compliance Score', value: '98%', trend: 'flat', percentage: '0%' }
];

const mockWorkforce = [
  { label: 'Engineering', value: 450 },
  { label: 'Sales', value: 320 },
  { label: 'Marketing', value: 150 },
  { label: 'HR', value: 45 },
  { label: 'Operations', value: 280 }
];

const mockInsights = [
  { id: 'INS-1', category: 'Recruitment', summary: 'Offer acceptance rate in Engineering increased by 15% this quarter.', impact: 'High', date: new Date().toISOString() },
  { id: 'INS-2', category: 'Compliance', summary: '30 employees in Sales have expiring data privacy certifications next week.', impact: 'Medium', date: new Date().toISOString() },
  { id: 'INS-3', category: 'Performance', summary: 'Goal completion rate is lagging in the Marketing department.', impact: 'High', date: new Date().toISOString() }
];

export const intelligenceService = {
  getExecutiveDashboard: async () => { await delay(); return mockKpis; },
  getWorkforceAnalytics: async () => { await delay(); return mockWorkforce; },
  getInsights: async () => { await delay(); return mockInsights; }
};
