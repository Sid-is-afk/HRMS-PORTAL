import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(3, 'Category name must be at least 3 characters.'),
  description: z.string().trim().min(5, 'Description must be at least 5 characters.'),
});

export const referenceValueSchema = z.object({
  code: z.string().trim()
    .min(2, 'Code must be at least 2 characters.')
    .regex(/^[A-Z0-9_]+$/, 'Code must be uppercase letters, numbers, and underscores only.'),
  name: z.string().trim().min(2, 'Display name must be at least 2 characters.'),
  description: z.string().trim().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'),
  metadata: z.object({
    color: z.string().trim().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Invalid HEX color code').optional().nullable(),
    allowOverallocate: z.boolean().default(false),
    requiresDocumentProof: z.boolean().default(false),
  }).optional().default({}),
});
