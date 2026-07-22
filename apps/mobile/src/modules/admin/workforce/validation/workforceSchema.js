import { z } from 'zod';

export const shiftSchema = z.object({
  name: z.string().min(2, 'Shift name is required'),
  type: z.string().min(1, 'Shift type is required'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  breakDuration: z.number().min(0, 'Break duration must be positive'),
  color: z.string().min(1, 'Color is required'),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
});

export const holidaySchema = z.object({
  name: z.string().min(2, 'Holiday name is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  type: z.enum(['NATIONAL', 'REGIONAL', 'OPTIONAL']),
  isRecurring: z.boolean().default(false),
});

export const attendancePolicySchema = z.object({
  name: z.string().min(2, 'Policy name is required'),
  graceIn: z.number().min(0),
  graceOut: z.number().min(0),
  lateArrivalThreshold: z.number().min(0),
  earlyExitThreshold: z.number().min(0),
  halfDayThreshold: z.number().min(0),
  absentThreshold: z.number().min(0),
});

export const weeklyOffSchema = z.object({
  days: z.array(z.string()).min(1, 'At least one day must be selected'),
});

export const workingHoursSchema = z.object({
  standardDailyHours: z.number().min(1).max(24),
  standardWeeklyHours: z.number().min(1).max(168),
});
