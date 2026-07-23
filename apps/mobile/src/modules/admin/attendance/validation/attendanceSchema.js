import { z } from 'zod';

export const regularizationSchema = z.object({
  attendance_record_id: z.string().uuid(),
  employee_id: z.string().uuid(),
  reason_code: z.string().min(1, 'Reason code is required'),
  comment: z.string().optional(),
  proposed_clock_in: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
  proposed_clock_out: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
}).refine(data => data.proposed_clock_in || data.proposed_clock_out, {
  message: 'Must provide either proposed clock in or clock out',
  path: ['proposed_clock_in']
});

export const attendanceFilterSchema = z.object({
  department_id: z.string().uuid().optional(),
  employee_id: z.string().uuid().optional(),
  status: z.enum(['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE', 'HOLIDAY', 'WEEKLY_OFF']).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
});
