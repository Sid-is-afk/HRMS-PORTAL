import { z } from 'zod';

export const featureToggleSchema = z.object({
  featureId: z.string(),
  enabled: z.boolean(),
});

export const defaultPolicySchema = z.object({
  passwordMinLength: z.number().min(8).max(64),
  sessionTimeoutMinutes: z.number().min(5).max(1440),
});
