'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpForm, useAuth } from '@matchpro/ui';

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('Signup page - Auth state:', { user, loading });
    if (!loading && user) {
      console.log('Signup page - User already logged in, redirecting to dashboard...');
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render signup form if already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
