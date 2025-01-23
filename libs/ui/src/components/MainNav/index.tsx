'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../Button';

const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
};

export function MainNav() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">MatchPro Resume</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href={AUTH_ROUTES.DASHBOARD}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href={AUTH_ROUTES.LOGIN}>
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href={AUTH_ROUTES.SIGNUP}>
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
