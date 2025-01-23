import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/confirm',
  '/auth/auth-error',
]

export async function authMiddleware(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const supabase = await createClient()

    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession()

    // Get the pathname of the request
    const path = new URL(request.url).pathname

    // Allow access to public routes
    if (publicRoutes.includes(path)) {
      return NextResponse.next()
    }

    // Check auth condition
    if (error || !session) {
      // Redirect to login if not authenticated
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect_to', path)
      return NextResponse.redirect(redirectUrl)
    }

    // Continue with the request if authenticated
    return NextResponse.next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    // Redirect to login on error
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}
