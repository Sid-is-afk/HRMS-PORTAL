import { z } from 'zod';

export const compensationSchema = z.object({
  base_salary: z.number().positive(),
  bonus: z.number().min(0),
  equity: z.number().min(0),
  currency: z.string().min(3).max(3),
});

export const offerSchema = z.object({
  candidate_id: z.string().min(1, "Candidate is required"),
  requisition_id: z.string().min(1, "Job Requisition is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  employment_type: z.string().min(1, "Employment Type is required"),
  compensation: compensationSchema,
  joining_date: z.string().min(1, "Joining Date is required"),
  reporting_manager: z.string().min(1, "Reporting Manager is required"),
  validity_days: z.number().min(1).max(90),
});

export const hiringDecisionSchema = z.object({
  candidate_id: z.string().min(1),
  requisition_id: z.string().min(1),
  decision: z.enum(['Approve', 'Reject', 'Hold', 'Escalate']),
  notes: z.string().optional(),
});
