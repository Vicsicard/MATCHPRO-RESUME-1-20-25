import { supabase } from '@matchpro/config/src/supabase';
import type { User } from '../types';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
  });

  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  if (!user) return null;

  return {
    id: user.id,
    email: user.email!,
    full_name: user.user_metadata.full_name,
    created_at: user.created_at,
    updated_at: user.last_sign_in_at || user.created_at,
  };
}
