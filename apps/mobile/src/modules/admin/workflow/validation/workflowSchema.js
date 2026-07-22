import { z } from 'zod';

export const workflowConfigSchema = z.object({
  name: z.string().trim().min(2, 'Workflow configuration name must be at least 2 characters.'),
  isSequential: z.boolean().default(true),
  escalationHours: z.preprocess(
    (val) => parseInt(val, 10) || 0,
    z.number().int().nonnegative('Escalation hours must be a positive integer.')
  ),
});

export const approvalActionSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'RETURN']),
  comment: z.string().trim().optional(),
}).refine((data) => {
  if ((data.action === 'REJECT' || data.action === 'RETURN') && (!data.comment || data.comment.length < 5)) {
    return false;
  }
  return true;
}, {
  message: 'A detailed comment (min 5 characters) is required when rejecting or returning a request.',
  path: ['comment'],
});

export const commentSchema = z.object({
  comment: z.string().trim().min(2, 'Comment must be at least 2 characters.').max(500, 'Comment cannot exceed 500 characters.'),
});

export const delegationSchema = z.object({
  delegateToId: z.string().trim().min(1, 'Please select an employee to delegate to.'),
});
