'use client'

import Link from 'next/link'

export default function AuthError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 text-center shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            There was an error verifying your authentication. This could be because:
          </p>
          <ul className="mt-4 list-disc text-left text-sm text-gray-600">
            <li>The verification link has expired</li>
            <li>The link has already been used</li>
            <li>The verification code is invalid</li>
          </ul>
        </div>
        <div className="mt-8">
          <Link
            href="/auth/login"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  )
}
