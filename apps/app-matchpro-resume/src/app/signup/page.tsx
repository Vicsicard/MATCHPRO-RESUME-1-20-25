import { SignUpForm } from '@matchpro/ui/src/components/Auth/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="mt-2 text-gray-600">
            Join MatchPro Resume to optimize your job search
          </p>
        </div>

        <SignUpForm />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
