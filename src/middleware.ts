import { authMiddleware } from './middleware/auth'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await authMiddleware(request)
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
}
