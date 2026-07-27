const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'talent-development');

const files = {
  'models/talentModels.js': `/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} employee_id
 * @property {string} title
 * @property {string} description
 * @property {number} progress_percentage
 * @property {string} status - Not Started, In Progress, Completed, At Risk
 * @property {string} due_date
 */

/**
 * @typedef {Object} LearningCourse
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {number} duration_minutes
 * @property {boolean} is_mandatory
 * @property {string} status - Not Started, In Progress, Completed
 * @property {number} completion_percentage
 */

/**
 * @typedef {Object} ComplianceRecord
 * @property {string} id
 * @property {string} requirement_name
 * @property {string} status - Compliant, Expiring Soon, Non-Compliant
 * @property {string} expiry_date
 */
`,

  'validation/talentSchema.js': `import { z } from 'zod';

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().min(1, "Due Date is required"),
  status: z.enum(['Not Started', 'In Progress', 'Completed', 'At Risk']),
});

export const courseAssignmentSchema = z.object({
  course_id: z.string().min(1),
  employee_ids: z.array(z.string()).min(1),
  due_date: z.string().optional(),
});
`,

  'store/talentStore.js': `import { create } from 'zustand';

export const useTalentStore = create((set) => ({
  goals: [],
  courses: [],
  complianceRecords: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  setGoals: (goals) => set({ goals }),
  setCourses: (courses) => set({ courses }),
  setComplianceRecords: (records) => set({ complianceRecords: records }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  updateGoalProgress: (goalId, progress) => set((state) => ({
    goals: state.goals.map(g => g.id === goalId ? { ...g, progress_percentage: progress } : g)
  })),
}));
`,

  'services/talentService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
`,

  'hooks/useTalentDevelopment.js': `import { useEffect } from 'react';
import { useTalentStore } from '../store/talentStore';
import { talentService } from '../services/talentService';

export function useTalentDevelopment() {
  const { 
    goals, courses, complianceRecords, 
    isLoading, error, setLoading, setError,
    setGoals, setCourses, setComplianceRecords 
  } = useTalentStore();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [g, c, comp] = await Promise.all([
        talentService.getGoals(),
        talentService.getLearningCatalog(),
        talentService.getComplianceStatus()
      ]);
      setGoals(g);
      setCourses(c);
      setComplianceRecords(comp);
    } catch (err) {
      setError(err.message || 'Failed to fetch talent data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { goals, courses, complianceRecords, isLoading, error, refresh: fetchData };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Talent core files created successfully.');
