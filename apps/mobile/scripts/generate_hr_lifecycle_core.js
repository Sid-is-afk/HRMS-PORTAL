const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'employee-lifecycle');

const files = {
  'models/lifecycleModels.js': `/**
 * @typedef {Object} EmployeeConversion
 * @property {string} id
 * @property {string} offer_id
 * @property {string} candidate_name
 * @property {string} proposed_employee_id
 * @property {string} assigned_department
 * @property {string} assigned_manager
 * @property {string} joining_date
 * @property {string} status - Pending, Converted, Failed
 */

/**
 * @typedef {Object} OnboardingTask
 * @property {string} id
 * @property {string} employee_id
 * @property {string} task_name
 * @property {string} description
 * @property {string} due_date
 * @property {boolean} is_completed
 * @property {string} category - IT, HR, Manager, Buddy
 */

/**
 * @typedef {Object} ProbationRecord
 * @property {string} id
 * @property {string} employee_id
 * @property {string} start_date
 * @property {string} end_date
 * @property {string} status - Active, Extended, Completed
 * @property {string} review_notes
 */
`,

  'validation/lifecycleSchema.js': `import { z } from 'zod';

export const employeeConversionSchema = z.object({
  offer_id: z.string().min(1, "Offer ID is required"),
  proposed_employee_id: z.string().min(1, "Employee ID is required"),
  assigned_department: z.string().min(1, "Department is required"),
  assigned_manager: z.string().min(1, "Manager is required"),
  joining_date: z.string().min(1, "Joining Date is required"),
});

export const onboardingTaskSchema = z.object({
  task_name: z.string().min(1),
  description: z.string().optional(),
  due_date: z.string().min(1),
  category: z.enum(['IT', 'HR', 'Manager', 'Buddy']),
});
`,

  'store/lifecycleStore.js': `import { create } from 'zustand';

export const useLifecycleStore = create((set) => ({
  conversions: [],
  onboardingTasks: [],
  probations: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  setConversions: (conversions) => set({ conversions }),
  setOnboardingTasks: (tasks) => set({ onboardingTasks: tasks }),
  setProbations: (probations) => set({ probations }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addConversion: (conversion) => set((state) => ({ conversions: [conversion, ...state.conversions] })),
  updateTaskStatus: (taskId, is_completed) => set((state) => ({
    onboardingTasks: state.onboardingTasks.map(t => t.id === taskId ? { ...t, is_completed } : t)
  })),
}));
`,

  'services/lifecycleService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
      id: \`CONV-\${Math.floor(Math.random() * 1000)}\`,
      status: 'Converted',
      ...conversionData
    };
  },

  getOnboardingTasks: async () => {
    await delay();
    return mockTasks;
  },

  updateTaskStatus: async (taskId, isCompleted) => {
    await delay();
    return { success: true };
  },

  getActiveProbations: async () => {
    await delay();
    return mockProbations;
  }
};
`,

  'hooks/useEmployeeLifecycle.js': `import { useEffect } from 'react';
import { useLifecycleStore } from '../store/lifecycleStore';
import { lifecycleService } from '../services/lifecycleService';

export function useEmployeeLifecycle() {
  const { 
    conversions, onboardingTasks, probations, 
    isLoading, error, setLoading, setError,
    setConversions, setOnboardingTasks, setProbations 
  } = useLifecycleStore();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [convs, tasks, probs] = await Promise.all([
        lifecycleService.getPendingConversions(),
        lifecycleService.getOnboardingTasks(),
        lifecycleService.getActiveProbations()
      ]);
      setConversions(convs);
      setOnboardingTasks(tasks);
      setProbations(probs);
    } catch (err) {
      setError(err.message || 'Failed to fetch lifecycle data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { conversions, onboardingTasks, probations, isLoading, error, refresh: fetchData };
}
`,

  'hooks/useLifecycleActions.js': `import { useLifecycleStore } from '../store/lifecycleStore';
import { lifecycleService } from '../services/lifecycleService';

export function useLifecycleActions() {
  const { addConversion, updateTaskStatus, setLoading, setError } = useLifecycleStore();

  const convertCandidate = async (data) => {
    try {
      setLoading(true);
      const newConversion = await lifecycleService.convertCandidate(data);
      addConversion(newConversion);
      return newConversion;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleOnboardingTask = async (taskId, isCompleted) => {
    try {
      await lifecycleService.updateTaskStatus(taskId, isCompleted);
      updateTaskStatus(taskId, isCompleted);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { convertCandidate, toggleOnboardingTask };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Lifecycle core files created successfully.');
