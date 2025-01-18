import { supabase } from '@matchpro/config/src/supabase';
import type { User, Resume, JobApplication, OptimizationResult, Subscription } from '../types';

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createResume(userId: string, title: string, content: string, fileUrl?: string): Promise<Resume> {
  const { data, error } = await supabase
    .from('resumes')
    .insert([
      {
        user_id: userId,
        title,
        content,
        file_url: fileUrl,
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
  company: string,
  position: string,
  jobDescription: string
): Promise<JobApplication> {
  const { data, error } = await supabase
    .from('job_applications')
    .insert([
      {
        user_id: userId,
        resume_id: resumeId,
        company,
        position,
        job_description: jobDescription,
        status: 'draft',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveOptimizationResult(
  userId: string,
  resumeId: string,
  jobApplicationId: string,
  originalContent: string,
  optimizedContent: string,
  matchScore?: number
): Promise<OptimizationResult> {
  const { data, error } = await supabase
    .from('optimization_results')
    .insert([
      {
        user_id: userId,
        resume_id: resumeId,
        job_application_id: jobApplicationId,
        original_content: originalContent,
        optimized_content: optimizedContent,
        match_score: matchScore,
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
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}
