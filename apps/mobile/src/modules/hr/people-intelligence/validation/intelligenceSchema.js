import { z } from 'zod';

export const analyticsFilterSchema = z.object({
  departmentId: z.string().optional(),
  locationId: z.string().optional(),
  dateRange: z.enum(['30d', '90d', '6m', '1y', 'ytd']),
});
