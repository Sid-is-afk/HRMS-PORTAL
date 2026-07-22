import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
const employeeIdRegex = /^[A-Z0-9-]{3,20}$/i;

export const emergencyContactSchema = z.object({
  name: z.string().trim().min(2, 'Contact name must be at least 2 characters.'),
  relationship: z.string().trim().min(2, 'Relationship is required.'),
  phone: z.string().trim().regex(phoneRegex, 'Please enter a valid phone number (e.g. +1234567890).'),
});

export const employeeCreateSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters.'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z.string().trim().regex(phoneRegex, 'Please enter a valid phone number.'),
  employeeId: z.string().trim().regex(employeeIdRegex, 'Employee ID must be 3-20 characters long and alphanumeric.'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'], {
    errorMap: () => ({ message: 'Please select an employment type.' }),
  }),
  joiningDate: z.string().trim().min(1, 'Please select a joining date.'),
  departmentId: z.string().trim().min(1, 'Please select a department.'),
  designationId: z.string().trim().min(1, 'Please select a designation.'),
  role: z.enum(['EMPLOYEE', 'ADMIN', 'HR', 'SUPER_ADMIN'], {
    errorMap: () => ({ message: 'Please select an access role.' }),
  }),
  managerId: z.string().optional().nullable(),
  emergencyContact: emergencyContactSchema,
});

export const employeeEditSchema = employeeCreateSchema.extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE']).default('ACTIVE'),
});
