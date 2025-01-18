import { z } from 'zod';

export const ResumeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  fileUrl: z.string().url(),
  fileType: z.enum(['PDF', 'DOCX']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const JobApplicationSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  jobId: z.string().uuid(),
  resumeId: z.string().uuid(),
  coverLetter: z.string().min(1),
  status: z.enum(['PENDING', 'SUBMITTED', 'VIEWED', 'REJECTED', 'ACCEPTED']).default('SUBMITTED'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
  title: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    graduationDate: z.string(),
    description: z.string().optional(),
  })),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Resume = z.infer<typeof ResumeSchema>;
export type JobApplication = z.infer<typeof JobApplicationSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
