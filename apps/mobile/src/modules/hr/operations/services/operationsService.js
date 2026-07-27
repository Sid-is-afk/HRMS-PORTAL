const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockRequests = [
  { id: 'SR-1001', employee_id: 'EMP-042', category: 'Document Request', priority: 'Medium', status: 'Open', created_at: new Date().toISOString() },
  { id: 'SR-1002', employee_id: 'EMP-015', category: 'Policy Clarification', priority: 'Low', status: 'In Progress', created_at: new Date().toISOString() }
];

const mockCases = [
  { id: 'CASE-405', title: 'Onboarding Delay - IT Provisioning', assignee_id: 'HR-02', status: 'Escalated', priority: 'Urgent' },
  { id: 'CASE-406', title: 'Salary Certificate Query', assignee_id: null, status: 'New', priority: 'Standard' }
];

const mockRules = [
  { id: 'RULE-1', name: 'Probation End Reminder', trigger: '14 Days Before Probation End', action: 'Send Email to Manager', is_active: true }
];

const mockReminders = [
  { id: 'REM-1', title: 'Complete Compliance Audit', type: 'One-Time', due_date: '2026-08-15', status: 'Pending' }
];

const mockApprovals = [
  { id: 'APP-1', source_module: 'Offer Management', requested_by: 'Jane Manager', summary: 'Offer Approval for Alice', status: 'Pending' }
];

export const operationsService = {
  getServiceRequests: async () => { await delay(); return mockRequests; },
  getCases: async () => { await delay(); return mockCases; },
  getAutomationRules: async () => { await delay(); return mockRules; },
  getReminders: async () => { await delay(); return mockReminders; },
  getApprovalQueue: async () => { await delay(); return mockApprovals; }
};
