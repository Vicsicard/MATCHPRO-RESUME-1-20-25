import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function useAuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirect_to')

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is authenticated, redirect to the requested page or dashboard
        router.replace(redirectTo || '/dashboard')
      }
    }
  }, [user, loading, redirectTo, router])

  return { user, loading }
}
