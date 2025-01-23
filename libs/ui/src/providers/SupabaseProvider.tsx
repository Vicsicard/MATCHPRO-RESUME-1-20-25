'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@matchpro/data'

interface SupabaseContextType {
  user: User | null
  session: Session | null
  loading: boolean
}

type SupabaseContextReturn = SupabaseContextType & {
  supabase: typeof supabase
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('SupabaseProvider - Setting up auth listener')
    
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('SupabaseProvider - Initial session:', session)
      if (session?.user) {
        console.log('SupabaseProvider - Setting initial user:', session.user)
        setUser(session.user)
      }
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('SupabaseProvider - Auth state change:', { event, session })
      
      if (session?.user) {
        console.log('SupabaseProvider - Setting user:', session.user)
        setUser(session.user)
      } else {
        console.log('SupabaseProvider - Clearing user')
        setUser(null)
      }
      setSession(session)
      setLoading(false)
    })

    return () => {
      console.log('SupabaseProvider - Cleaning up auth listener')
      subscription.unsubscribe()
    }
  }, [])

  return (
    <SupabaseContext.Provider value={{ user, session, loading }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase(): SupabaseContextReturn {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return { ...context, supabase }
}
