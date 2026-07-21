import { z } from 'zod';

// Email or Phone validation. Phone can just be checked for minimal length.
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or Employee ID is required'),
  password: z.string().min(1, 'Password is required'),
});
