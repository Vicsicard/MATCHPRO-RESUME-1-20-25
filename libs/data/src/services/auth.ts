import type { User } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { AuthError } from '@supabase/supabase-js'
import { createTrialSubscription, checkSubscriptionStatus } from './subscription'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function waitForUserCreation(userId: string, maxAttempts = 10): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (data) {
      return true
    }

    // Wait for 1 second before trying again
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  return false
}

async function createUserProfile(user: User): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .insert([
      {
        id: user.id,
        email: user.email,
      },
    ])
    .select()
    .single()

  return !!data
}

export async function signUp(email: string, password: string) {
  try {
    console.log('auth.ts - Starting sign up for email:', email)
    console.log('auth.ts - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    const { data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (!data?.user) {
      throw new Error('No user data returned')
    }

    // Wait for user record to be created in the database
    const userCreated = await waitForUserCreation(data.user.id)
    if (!userCreated) {
      throw new Error('Failed to create user record')
    }

    // Create user profile
    const profileCreated = await createUserProfile(data.user)
    if (!profileCreated) {
      throw new Error('Failed to create user profile')
    }

    // Create trial subscription
    await createTrialSubscription(data.user.id)

    return { user: data.user, error: null }
  } catch (err) {
    const error = err as AuthError
    return {
      user: null,
      error: {
        message: error.message,
        status: error.status || 500
      }
    }
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log('auth.ts - Starting sign in for email:', email)
    
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!data?.user) {
      throw new Error('No user data returned')
    }

    // Check subscription status
    const subscription = await checkSubscriptionStatus(data.user.id)
    if (!subscription) {
      throw new Error('Failed to get subscription status')
    }

    return { user: data.user, subscription, error: null }
  } catch (err) {
    const error = err as AuthError
    return {
      user: null,
      subscription: null,
      error: {
        message: error.message,
        status: error.status || 500
      }
    }
  }
}

export async function signOut() {
  try {
    console.log('auth.ts - Starting sign out...')
    await supabase.auth.signOut()
    console.log('auth.ts - Sign out successful')
    return { error: null }
  } catch (err) {
    const error = err as AuthError
    return {
      error: {
        message: error.message,
        status: error.status || 500
      }
    }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log('auth.ts - Getting current user...')
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      console.log('auth.ts - No active session found')
      return null
    }

    console.log('auth.ts - Current user:', session.user)
    return session.user
  } catch (err) {
    console.error('auth.ts - Error getting current user:', err)
    return null
  }
}
