'use client';

import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single Supabase client instance with session persistence
const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: true,
    storageKey: 'matchpro-auth',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export async function signIn(email: string, password: string) {
  try {
    console.log('auth.ts - Starting sign in for email:', email);
    
    console.log('auth.ts - Calling signInWithPassword...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('auth.ts - Sign in error:', error.message);
      throw error;
    }

    if (!data?.user) {
      console.error('auth.ts - No user data returned');
      throw new Error('No user data returned');
    }

    console.log('auth.ts - Sign in successful:', data.user);
    return { user: data.user };
  } catch (error) {
    console.error('auth.ts - Unexpected error during sign in:', error);
    throw error;
  }
}

export async function signUp(email: string, password: string) {
  try {
    console.log('auth.ts - Starting sign up for email:', email);
    
    console.log('auth.ts - Calling signUp...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('auth.ts - Sign up error:', error.message);
      throw error;
    }

    if (!data?.user) {
      console.error('auth.ts - No user data returned');
      throw new Error('No user data returned');
    }

    console.log('auth.ts - Sign up successful:', data.user);
    return { user: data.user };
  } catch (error) {
    console.error('auth.ts - Unexpected error during sign up:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    console.log('auth.ts - Starting sign out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('auth.ts - Sign out error:', error.message);
      throw error;
    }
    console.log('auth.ts - Sign out successful');
  } catch (error) {
    console.error('auth.ts - Unexpected error during sign out:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log('auth.ts - Getting current user...');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('auth.ts - Get session error:', error.message);
      throw error;
    }

    if (!session?.user) {
      console.log('auth.ts - No active session found');
      return null;
    }

    console.log('auth.ts - Current user:', session.user);
    return session.user;
  } catch (error) {
    console.error('auth.ts - Unexpected error getting current user:', error);
    throw error;
  }
}
