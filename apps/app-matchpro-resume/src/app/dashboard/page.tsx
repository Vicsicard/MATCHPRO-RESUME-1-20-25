'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@matchpro/data';

function ProgressCard({
  title,
  description,
  status,
  percentage,
  link,
  disabled,
}: {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'locked';
  percentage: number;
  link: string;
  disabled: boolean;
}) {
  return (
    <div className={`rounded-lg border p-6 ${disabled ? 'opacity-50' : ''}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
      <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-4 flex justify-between">
        <span className="text-sm text-gray-500">{status}</span>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
      {!disabled && (
        <Link href={link}>
          <button className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Continue
          </button>
        </Link>
      )}
    </div>
  );
}

function SubscriptionBanner({ status, expiresAt }: { status: string | null; expiresAt: Date | null }) {
  if (!status) return null;

  const isActive = status === 'active';
  const expiresIn = expiresAt ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div
      className={`mb-6 rounded-lg p-4 ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {isActive ? (
        <>
          <h3 className="font-semibold">Active Subscription</h3>
          <p>
            Your subscription is active.
            {expiresAt && ` Expires in ${expiresIn} days.`}
          </p>
        </>
      ) : (
        <>
          <h3 className="font-semibold">Limited Access</h3>
          <p>
            You are currently on the free plan.{' '}
            <Link href="/pricing" className="underline">
              Upgrade now
            </Link>{' '}
            for full access.
          </p>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Welcome back!</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <ProgressCard
          title="Resume Optimization"
          description="Get AI-powered suggestions to improve your resume"
          status="pending"
          percentage={0}
          link="/optimize"
          disabled={false}
        />
        <ProgressCard
          title="Job Matching"
          description="Find jobs that match your skills and experience"
          status="locked"
          percentage={0}
          link="/jobs"
          disabled={true}
        />
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">Recent Activity</h2>
        <p className="text-gray-600">No recent activity to show.</p>
      </div>
    </div>
  );
}
