import { createClient } from './supabase/client';
import type { User } from '@supabase/supabase-js';

const supabase = createClient();

export const signIn = async (email: string, password: string): Promise<User | null> => {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return user;
};

export const signUp = async (email: string, password: string): Promise<User | null> => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return user;
};

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { user } = await supabase.auth.getUser();
  return user;
};
