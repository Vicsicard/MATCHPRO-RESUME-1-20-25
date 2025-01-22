'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignInForm, useAuth } from '@matchpro/ui';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('Login page - User state:', { user, loading });
    if (user && !loading) {
      console.log('User is already logged in, redirecting to dashboard...');
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
