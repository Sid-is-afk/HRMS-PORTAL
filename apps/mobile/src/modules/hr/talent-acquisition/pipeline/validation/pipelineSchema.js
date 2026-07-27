import { z } from 'zod';

export const candidateProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().trim().min(10, 'Phone number must be at least 10 digits.'),
  skills: z.array(z.string()).min(1, 'Please add at least one skill.'),
  experienceYears: z.number().nonnegative('Experience years cannot be negative.'),
  education: z.string().trim().min(1, 'Education level/school is required.'),
  resumeMetadata: z.string().optional(),
  tags: z.array(z.string()).optional(),
  currentJobTitle: z.string().trim().min(1, 'Vacancy job title is required.'),
});

export const panelMemberSchema = z.object({
  employeeId: z.string().min(1, 'Panel member employee ID is required.'),
  name: z.string().min(1, 'Panel member name is required.'),
  email: z.string().email('Panel member must have a valid email.'),
});

export const interviewSchedulingSchema = z.object({
  candidateId: z.string().min(1, 'Candidate selection is required.'),
  roundNumber: z.number().int().positive('Round number must be at least 1.'),
  type: z.enum(['SCREENING', 'TECHNICAL', 'MANAGER', 'HR'], {
    errorMap: () => ({ message: 'Please select a valid interview type.' }),
  }),
  mode: z.enum(['ONLINE', 'IN_PERSON', 'PHONE'], {
    errorMap: () => ({ message: 'Please select a valid interview mode.' }),
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Please select a valid date.',
  }),
  time: z.string().trim().min(4, 'Please enter a valid meeting time (e.g. 14:30).'),
  panelMembers: z.array(panelMemberSchema).min(1, 'Please assign at least one interviewer.'),
  meetingLink: z.string().optional(),
});

export const interviewFeedbackSchema = z.object({
  score: z.number().int().min(1, 'Rating must be at least 1.').max(5, 'Rating cannot exceed 5.'),
  recommendation: z.enum(['HIRE', 'NO_HIRE', 'STRONG_HIRE', 'STRONG_NO_HIRE', 'HOLD'], {
    errorMap: () => ({ message: 'Recommendation is required.' }),
  }),
  comments: z.string().trim().min(5, 'Comments must be at least 5 characters.'),
});

export const recruiterNoteSchema = z.object({
  content: z.string().trim().min(2, 'Note content must be at least 2 characters.'),
});

export const stageTransitionSchema = z.object({
  fromStage: z.string().min(1),
  toStage: z.string().min(1),
});
