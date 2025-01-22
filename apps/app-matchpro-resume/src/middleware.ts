import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that don't require access check
const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/callback',
  '/api/auth/callback',
  '/api/stripe/webhook',
  '/pricing',
  '/success',
  '/cancel',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware - Processing request for:', pathname);

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    console.log('Middleware - Public path, allowing access');
    return NextResponse.next();
  }

  try {
    console.log('Middleware - Processing request:', request.url);
    const res = NextResponse.next();

    // Get Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get session from cookie
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Middleware - Error getting session:', error);
      return res;
    }

    console.log('Middleware - Session check:', {
      hasSession: !!session,
      path: request.nextUrl.pathname,
    });

    // If accessing dashboard without session, redirect to login
    if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('Middleware - Unauthorized dashboard access, redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If accessing auth pages with session, redirect to dashboard
    if (session && (request.nextUrl.pathname.startsWith('/auth/'))) {
      console.log('Middleware - Authenticated user accessing auth page, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware - Unexpected error:', error);
    return NextResponse.next();
  }
}

// Add paths that should be protected
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/api/protected/:path*',
    '/auth/:path*',
  ],
};
