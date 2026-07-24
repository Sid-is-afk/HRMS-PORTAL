import { z } from 'zod';

export const audienceFilterSchema = z.object({
  all_employees: z.boolean().default(false),
  department_ids: z.array(z.string().uuid()).optional(),
  location_ids: z.array(z.string().uuid()).optional(),
  employment_types: z.array(z.string()).optional(),
  specific_employee_ids: z.array(z.string().uuid()).optional(),
}).refine(data => {
  if (data.all_employees) return true;
  const hasSpecifics = (data.department_ids?.length || data.location_ids?.length || data.employment_types?.length || data.specific_employee_ids?.length);
  return !!hasSpecifics;
}, {
  message: 'Must select at least one target audience if not sending to all employees',
});

export const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(100),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  type_id: z.string().uuid('Please select a communication type'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  audience: audienceFilterSchema,
  scheduled_at: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Invalid date format').optional().nullable(),
  expires_at: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Invalid date format').optional().nullable(),
});
