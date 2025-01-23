'use client';

import { useAuth } from '@matchpro/ui';

export default function DashboardPage() {
  const { user, subscriptionStatus, subscriptionExpiresAt } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="border-b border-gray-200 pb-5">
            <h3 className="text-2xl font-semibold leading-6 text-gray-900">Dashboard</h3>
          </div>
          
          <div className="mt-6">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Welcome back, {user?.email}!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900">Subscription Status</h4>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Current status: <span className="font-medium">{subscriptionStatus}</span>
                </p>
                {subscriptionExpiresAt && (
                  <p className="mt-1">
                    Expires: <span className="font-medium">{new Date(subscriptionExpiresAt).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
