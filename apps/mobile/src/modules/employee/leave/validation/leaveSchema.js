import { z } from 'zod';

export const leaveApplicationSchema = z
  .object({
    leaveType: z.string().trim().min(1, 'Please select a leave type.'),
    startDate: z.string().trim().min(1, 'Select a start date.'),
    endDate: z.string().trim().min(1, 'Select an end date.'),
    halfDay: z.boolean().optional().default(false),
    reason: z
      .string()
      .trim()
      .min(5, 'Please add a short reason for this leave request.')
      .max(250, 'Reason should be within 250 characters.'),
  })
  .superRefine((data, ctx) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: 'Please use a valid date format.',
      });
      return;
    }

    if (startDate > endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'End date cannot be earlier than start date.',
      });
    }

    if (data.halfDay && startDate.toDateString() !== endDate.toDateString()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['halfDay'],
        message: 'Half-day leave must be requested for a single day.',
      });
    }
  });

export const leaveReasonSchema = z.string().trim().min(5, 'Reason must be at least 5 characters long.');
