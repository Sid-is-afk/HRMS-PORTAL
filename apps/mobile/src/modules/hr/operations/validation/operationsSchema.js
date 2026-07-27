import { z } from 'zod';

export const serviceRequestSchema = z.object({
  category: z.string().min(1),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  status: z.enum(['Open', 'In Progress', 'Resolved', 'Closed']),
});

export const hrCaseSchema = z.object({
  title: z.string().min(1),
  assignee_id: z.string().optional(),
  status: z.enum(['New', 'Assigned', 'Escalated', 'Closed']),
});
