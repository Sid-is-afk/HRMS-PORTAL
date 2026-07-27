import { z } from 'zod';

export const tenantCreationSchema = z.object({
  name: z.string().min(2, 'Organization Name is required'),
  orgCode: z.string().min(3, 'Organization Code is required').max(10),
  industry: z.string().min(1, 'Industry is required'),
  primaryContact: z.string().email('Valid email is required for primary contact'),
});
