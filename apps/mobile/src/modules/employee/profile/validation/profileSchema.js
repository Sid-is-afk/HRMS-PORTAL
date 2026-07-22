import { z } from 'zod';

export const profileUpdateSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  phone: z.string().trim().min(5, 'Phone number is required.'),
  address: z.string().trim().min(3, 'Address is required.'),
  location: z.string().trim().min(1, 'Location is required.'),
});

export const emergencyContactSchema = z.object({
  name: z.string().trim().min(1, 'Contact name is required.'),
  relationship: z.string().trim().min(1, 'Relationship is required.'),
  phone: z.string().trim().min(5, 'Phone number is required.'),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      });
    }
  });
