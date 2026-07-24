import { z } from 'zod';

export const applicationSettingSchema = z.object({
  key: z.string(),
  category: z.string(),
  label: z.string(),
  value: z.any(),
  type: z.enum(['string', 'number', 'boolean', 'json'])
});

export const featureFlagSchema = z.object({
  id: z.string(),
  is_enabled: z.boolean(),
});
