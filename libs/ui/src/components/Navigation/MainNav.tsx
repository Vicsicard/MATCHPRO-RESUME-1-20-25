'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu as MenuIcon,
  X as XIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
} from 'lucide-react';
import { Button } from '../Button';

export function MainNav() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Resume Optimizer', href: '/resume-optimizer' },
    { name: 'Interview Coach', href: '/interview-coach' },
    { name: 'Job Matching', href: '/job-matching' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                MatchPro
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user.full_name || user.email}
                </span>
                <Button
                  onClick={() => signOut()}
                  variant="outlined"
                  size="small"
                  startIcon={<LogOutIcon className="h-4 w-4" />}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/signin">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<UserIcon className="h-4 w-4" />}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {/* Mobile User Menu */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-2">
                <div className="px-4">
                  <p className="text-sm font-medium text-gray-700">
                    {user.full_name || user.email}
                  </p>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<LogOutIcon className="h-4 w-4" />}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="px-4">
                <Link href="/signin">
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    startIcon={<UserIcon className="h-4 w-4" />}
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
