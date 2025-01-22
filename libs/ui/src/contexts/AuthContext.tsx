'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signIn, signOut, signUp } from '@matchpro/data';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a single Supabase client instance
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const checkUser = useCallback(async () => {
    try {
      console.log('AuthContext - Checking user...');
      const user = await getCurrentUser();
      console.log('AuthContext - User found:', user);
      setUser(user);
    } catch (error: any) {
      console.log('AuthContext - Error checking user:', error);
      if (!error.message?.includes('Auth session missing')) {
        console.error('AuthContext - Error checking user:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRedirect = useCallback((path: string) => {
    if (!isRedirecting) {
      setIsRedirecting(true);
      console.log('AuthContext - Redirecting to:', path);
      router.push(path);
      // Reset redirect flag after a delay
      setTimeout(() => setIsRedirecting(false), 1000);
    }
  }, [router, isRedirecting]);

  useEffect(() => {
    console.log('AuthContext - Setting up auth listener...');
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext - Auth state changed:', { event, hasUser: !!session?.user });
      
      if (session?.user) {
        setUser(session.user);
        if (event === 'SIGNED_IN' && !isRedirecting) {
          handleRedirect('/dashboard');
        }
      } else {
        setUser(null);
        if (event === 'SIGNED_OUT' && !isRedirecting) {
          handleRedirect('/auth/login');
        }
      }
      setLoading(false);
    });

    // Initial user check
    checkUser();

    return () => {
      console.log('AuthContext - Cleaning up auth listener...');
      subscription.unsubscribe();
    };
  }, [checkUser, handleRedirect, isRedirecting]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('AuthContext - Starting sign in...');
      const { user: signedInUser } = await signIn(email, password);
      console.log('AuthContext - Sign in successful:', signedInUser);
      setUser(signedInUser);
      handleRedirect('/dashboard');
    } catch (error) {
      console.error('AuthContext - Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('AuthContext - Starting sign up...');
      const { user: signedUpUser } = await signUp(email, password);
      console.log('AuthContext - Sign up successful:', signedUpUser);
      setUser(signedUpUser);
      handleRedirect('/dashboard');
    } catch (error) {
      console.error('AuthContext - Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      console.log('AuthContext - Starting sign out...');
      await signOut();
      console.log('AuthContext - Sign out successful');
      setUser(null);
      handleRedirect('/auth/login');
    } catch (error) {
      console.error('AuthContext - Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
