import { z } from 'zod';

export const jobRequisitionSchema = z.object({
  title: z.string().trim().min(2, 'Job title must be at least 2 characters.'),
  departmentId: z.string().min(1, 'Department is required.'),
  hiringManagerId: z.string().min(1, 'Hiring Manager is required.'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'], {
    errorMap: () => ({ message: 'Please select a valid employment type.' }),
  }),
  locationId: z.string().min(1, 'Location is required.'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'Please select a valid priority level.' }),
  }),
  openPositions: z.number().int().positive('Open positions must be at least 1.'),
  requiredSkills: z.array(z.string()).min(1, 'At least one required skill is required.'),
  experienceMin: z.number().min(0, 'Minimum experience cannot be negative.'),
  experienceMax: z.number().min(0, 'Maximum experience cannot be negative.'),
  salaryMin: z.number().nonnegative('Salary cannot be negative.').optional(),
  salaryMax: z.number().nonnegative('Salary cannot be negative.').optional(),
}).refine((data) => data.experienceMax >= data.experienceMin, {
  message: 'Maximum experience must be greater than or equal to minimum experience.',
  path: ['experienceMax'],
}).refine((data) => {
  if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
    return data.salaryMax >= data.salaryMin;
  }
  return true;
}, {
  message: 'Maximum salary must be greater than or equal to minimum salary.',
  path: ['salaryMax'],
});

export const jobPostingSchema = z.object({
  requisitionId: z.string().min(1, 'Requisition link is required.'),
  title: z.string().trim().min(2, 'Job posting title must be at least 2 characters.'),
  description: z.string().trim().min(10, 'Job description must be at least 10 characters.'),
  type: z.enum(['INTERNAL', 'EXTERNAL'], {
    errorMap: () => ({ message: 'Please select a valid posting type.' }),
  }),
  status: z.enum(['DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED', 'ARCHIVED']),
  expirationDate: z.string().optional().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    return date > new Date();
  }, {
    message: 'Expiration date must be in the future.',
  }),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
});

export const searchSchema = z.string().trim();

export const filterSchema = z.object({
  departmentId: z.string().optional(),
  hiringManagerId: z.string().optional(),
  employmentType: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});
