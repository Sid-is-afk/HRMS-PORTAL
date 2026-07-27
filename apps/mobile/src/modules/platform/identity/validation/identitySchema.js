import { z } from 'zod';

export const platformUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.string().min(1, 'Role is required'),
});
