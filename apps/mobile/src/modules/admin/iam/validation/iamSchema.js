import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().trim().min(3, 'Role name must be at least 3 characters.'),
  code: z.string().trim()
    .min(3, 'Role code must be at least 3 characters.')
    .regex(/^[A-Z0-9_]+$/, 'Role code must be uppercase letters, numbers, and underscores only.')
    .transform(val => val.startsWith('ROLE_') ? val : `ROLE_${val}`),
  description: z.string().trim().min(5, 'Description must be at least 5 characters.'),
  parentRoleId: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'),
  permissions: z.array(z.string()).default([]),
});

export const roleAssignmentSchema = z.object({
  employeeId: z.string().trim().min(1, 'Please select an employee.'),
  roleId: z.string().trim().min(1, 'Please select a role.'),
});

export const accessPolicySchema = z.object({
  name: z.string().trim().min(3, 'Policy name must be at least 3 characters.'),
  description: z.string().trim().min(5, 'Description must be at least 5 characters.'),
  priority: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().int().min(1, 'Priority must be at least 1.').max(100, 'Priority max is 100.')
  ),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  conditions: z.object({
    ipRange: z.string().trim().optional().nullable(),
    timeWindowStart: z.string().trim().optional().nullable(),
    timeWindowEnd: z.string().trim().optional().nullable(),
    mfaRequired: z.boolean().default(false),
  }).default({}),
});

export const permissionMappingSchema = z.object({
  roleId: z.string().trim().min(1, 'Role is required.'),
  permissionCodes: z.array(z.string()),
});
