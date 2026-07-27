import { z } from 'zod';

export const logFilterSchema = z.object({
  level: z.enum(['INFO', 'WARN', 'ERROR', 'ALL']).optional(),
  source: z.string().optional(),
  search: z.string().optional(),
});
