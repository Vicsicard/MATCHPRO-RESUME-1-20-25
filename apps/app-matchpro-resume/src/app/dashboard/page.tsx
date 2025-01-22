'use client';

import { ProtectedRoute } from '@matchpro/ui';
import { ResumeOptimizer } from '../../components/ResumeOptimizer';
import { useAuth } from '@matchpro/ui';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Welcome back, {user?.full_name || 'User'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Let's optimize your resume for your next opportunity.
                  </p>
                </div>
              </div>

              {/* Resume Optimizer Section */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Resume Optimizer
                  </h3>
                  <ResumeOptimizer userId={user?.id || ''} />
                </div>
              </div>

              {/* Quick Links Section */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Quick Links
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <a
                      href="/interview-coach"
                      className="block p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <h4 className="text-base font-medium text-gray-900">
                        Interview Coach
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Practice interviews with AI
                      </p>
                    </a>
                    <a
                      href="/job-matching"
                      className="block p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <h4 className="text-base font-medium text-gray-900">
                        Job Matching
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Find jobs that match your profile
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
