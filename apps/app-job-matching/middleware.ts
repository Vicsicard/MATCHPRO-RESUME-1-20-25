import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/reset-password'];
// Routes that are only accessible to authenticated users
const protectedRoutes = ['/dashboard', '/profile', '/jobs'];

export async function middleware(request: NextRequest) {
  try {
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });

    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession();

    const pathname = request.nextUrl.pathname;
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Handle protected routes
    if (isProtectedRoute) {
      if (!session) {
        // Redirect to login if trying to access protected route without session
        const redirectUrl = new URL('/auth/login', request.url);
        redirectUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Handle public routes (optional)
    if (isPublicRoute && session) {
      // Redirect to dashboard if trying to access public route with session
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow the request to continue
    return NextResponse.next();
  } catch (e) {
    // If there's an error, redirect to login
    console.error('Middleware error:', e);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/profile/:path*',
    '/jobs/:path*',
    // Public routes we want to handle redirects for
    '/auth/:path*',
  ],
};
