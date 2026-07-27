const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'operations');

const files = {
  'models/operationsModels.js': `/**
 * @typedef {Object} ServiceRequest
 * @property {string} id
 * @property {string} employee_id
 * @property {string} category - Employment Verification, Document Request, Policy Clarification
 * @property {string} priority - Low, Medium, High, Critical
 * @property {string} status - Open, In Progress, Resolved, Closed
 * @property {string} created_at
 */

/**
 * @typedef {Object} HRCase
 * @property {string} id
 * @property {string} title
 * @property {string} assignee_id
 * @property {string} status - New, Assigned, Escalated, Closed
 * @property {string} priority - Standard, Urgent
 */

/**
 * @typedef {Object} AutomationRule
 * @property {string} id
 * @property {string} name
 * @property {string} trigger
 * @property {string} action
 * @property {boolean} is_active
 */

/**
 * @typedef {Object} Reminder
 * @property {string} id
 * @property {string} title
 * @property {string} type - One-Time, Recurring
 * @property {string} due_date
 * @property {string} status - Pending, Sent
 */

/**
 * @typedef {Object} ApprovalQueueItem
 * @property {string} id
 * @property {string} source_module
 * @property {string} requested_by
 * @property {string} summary
 * @property {string} status - Pending
 */
`,

  'validation/operationsSchema.js': `import { z } from 'zod';

export const serviceRequestSchema = z.object({
  category: z.string().min(1),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  status: z.enum(['Open', 'In Progress', 'Resolved', 'Closed']),
});

export const hrCaseSchema = z.object({
  title: z.string().min(1),
  assignee_id: z.string().optional(),
  status: z.enum(['New', 'Assigned', 'Escalated', 'Closed']),
});
`,

  'store/operationsStore.js': `import { create } from 'zustand';

export const useOperationsStore = create((set) => ({
  serviceRequests: [],
  cases: [],
  automationRules: [],
  reminders: [],
  approvals: [],
  isLoading: false,
  error: null,

  setServiceRequests: (requests) => set({ serviceRequests: requests }),
  setCases: (cases) => set({ cases }),
  setAutomationRules: (rules) => set({ automationRules: rules }),
  setReminders: (reminders) => set({ reminders }),
  setApprovals: (approvals) => set({ approvals }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
`,

  'services/operationsService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
`,

  'hooks/useOperations.js': `import { useEffect } from 'react';
import { useOperationsStore } from '../store/operationsStore';
import { operationsService } from '../services/operationsService';

export function useOperations() {
  const store = useOperationsStore();

  const fetchData = async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const [reqs, cases, rules, rems, apps] = await Promise.all([
        operationsService.getServiceRequests(),
        operationsService.getCases(),
        operationsService.getAutomationRules(),
        operationsService.getReminders(),
        operationsService.getApprovalQueue()
      ]);
      store.setServiceRequests(reqs);
      store.setCases(cases);
      store.setAutomationRules(rules);
      store.setReminders(rems);
      store.setApprovals(apps);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch operations data');
    } finally {
      store.setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { ...store, refresh: fetchData };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Operations core files created successfully.');
