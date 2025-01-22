'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@matchpro/ui';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('DashboardPage - Component mounted');
    console.log('DashboardPage - Auth state:', { user, loading });

    if (!loading && !user) {
      console.log('DashboardPage - No user found, redirecting to login...');
      router.replace('/auth/login');
      return;
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    console.log('DashboardPage - Loading...');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show unauthorized message if no user
  if (!user) {
    console.log('DashboardPage - Not authorized');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authorized</h1>
          <p className="text-gray-600">Please sign in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  console.log('DashboardPage - Rendering dashboard for user:', user.email);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="text-gray-600 mb-4">
          You are signed in as: <span className="font-semibold">{user.email}</span>
        </p>
        
        {/* Add your dashboard content here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Resume Analysis</h2>
            <p className="text-gray-600">Upload your resume for AI-powered analysis</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Job Matching</h2>
            <p className="text-gray-600">Find jobs that match your skills</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Profile</h2>
            <p className="text-gray-600">Update your profile and preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
}
