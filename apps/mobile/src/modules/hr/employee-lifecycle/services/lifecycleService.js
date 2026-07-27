const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockConversions = [
  {
    id: 'CONV-001',
    offer_id: 'OFF-001',
    candidate_name: 'Alice Johnson',
    proposed_employee_id: 'EMP-1042',
    assigned_department: 'Engineering',
    assigned_manager: 'Bob Smith',
    joining_date: '2026-09-01',
    status: 'Pending',
  }
];

const mockTasks = [
  { id: 'TSK-1', employee_id: 'EMP-1042', task_name: 'Laptop Provisioning', category: 'IT', due_date: '2026-08-30', is_completed: false },
  { id: 'TSK-2', employee_id: 'EMP-1042', task_name: 'Verify ID Documents', category: 'HR', due_date: '2026-09-01', is_completed: true },
];

const mockProbations = [
  { id: 'PROB-1', employee_id: 'EMP-0999', start_date: '2026-03-01', end_date: '2026-09-01', status: 'Active', review_notes: 'Performing well.' }
];

export const lifecycleService = {
  getPendingConversions: async () => {
    await delay();
    return mockConversions;
  },
  
  convertCandidate: async (conversionData) => {
    await delay();
    return {
      id: `CONV-${Math.floor(Math.random() * 1000)}`,
      status: 'Converted',
      ...conversionData
    };
  },

  getOnboardingTasks: async () => {
    await delay();
    return mockTasks;
  },

  updateTaskStatus: async (_taskId, _isCompleted) => {
    await delay();
    return { success: true };
  },

  getActiveProbations: async () => {
    await delay();
    return mockProbations;
  }
};
