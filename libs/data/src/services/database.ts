import { supabase } from '@matchpro/config/src/supabase';
import type { Resume, JobApplication, OptimizationResult, Subscription, User } from '../types/index';

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createResume(userId: string, content: string): Promise<Resume> {
  const { data, error } = await supabase
    .from('resumes')
    .insert([
      {
        userId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createJobApplication(
  userId: string,
  resumeId: string,
  jobTitle: string,
  company: string
): Promise<JobApplication> {
  const { data, error } = await supabase
    .from('job_applications')
    .insert([
      {
        userId,
        resumeId,
        jobTitle,
        company,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveOptimizationResult(
  resumeId: string,
  jobApplicationId: string,
  optimizedContent: string,
  score: number,
  feedback: string
): Promise<OptimizationResult> {
  const { data, error } = await supabase
    .from('optimization_results')
    .insert([
      {
        resumeId,
        jobApplicationId,
        optimizedContent,
        score,
        feedback,
        createdAt: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error) throw error;
  return data;
}
