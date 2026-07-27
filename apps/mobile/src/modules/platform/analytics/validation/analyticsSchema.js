import { z } from 'zod';

export const analyticsFilterSchema = z.object({
  dateRange: z.enum(['7D', '30D', '90D', 'YTD', 'ALL']).optional(),
  tenantId: z.string().optional(),
});
