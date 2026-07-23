import { z } from 'zod';

export const leaveRequestSchema = z.object({
  employee_id: z.string().uuid(),
  leave_type_id: z.string().uuid(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  is_half_day: z.boolean().default(false),
  reason: z.string().min(5, 'Reason must be at least 5 characters long'),
}).refine((data) => {
  return new Date(data.start_date) <= new Date(data.end_date);
}, {
  message: 'End date must be after or equal to start date',
  path: ['end_date']
});

export const leaveFilterSchema = z.object({
  department_id: z.string().uuid().optional(),
  employee_id: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).optional(),
  leave_type_id: z.string().uuid().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
});
