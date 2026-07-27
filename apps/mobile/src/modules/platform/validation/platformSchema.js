import { z } from 'zod';

export const platformSearchSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
  filter: z.enum(['All', 'Organizations', 'Users', 'Logs']).optional()
});
