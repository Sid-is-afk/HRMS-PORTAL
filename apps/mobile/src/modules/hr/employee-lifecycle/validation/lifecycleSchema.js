import { z } from 'zod';

export const employeeConversionSchema = z.object({
  offer_id: z.string().min(1, "Offer ID is required"),
  proposed_employee_id: z.string().min(1, "Employee ID is required"),
  assigned_department: z.string().min(1, "Department is required"),
  assigned_manager: z.string().min(1, "Manager is required"),
  joining_date: z.string().min(1, "Joining Date is required"),
});

export const onboardingTaskSchema = z.object({
  task_name: z.string().min(1),
  description: z.string().optional(),
  due_date: z.string().min(1),
  category: z.enum(['IT', 'HR', 'Manager', 'Buddy']),
});
