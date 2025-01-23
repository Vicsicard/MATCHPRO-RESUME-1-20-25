'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { EmailOtpType } from '@supabase/supabase-js';
import { supabase } from '@matchpro/data';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType;

    if (token_hash && type) {
      supabase.auth.verifyOtp({ token_hash, type }).then(({ error }) => {
        if (error) {
          setError(error.message);
        } else {
          router.push('/dashboard');
        }
        setLoading(false);
      });
    } else {
      setError('Invalid confirmation link');
      setLoading(false);
    }
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
        <button
          onClick={() => router.push('/auth/login')}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Confirming your email...</p>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
