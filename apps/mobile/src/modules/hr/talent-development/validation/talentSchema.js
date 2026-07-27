import { z } from 'zod';

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
