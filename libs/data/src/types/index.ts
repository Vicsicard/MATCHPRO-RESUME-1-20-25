import type { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser;

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  resumeId: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'submitted' | 'interviewing' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface OptimizationResult {
  id: string;
  resumeId: string;
  jobApplicationId: string;
  optimizedContent: string;
  score: number;
  feedback: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'canceled' | 'expired';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}
