// Export auth functions
export { signIn, signUp, signOut, getCurrentUser } from './services/auth';
export { AuthProvider, useAuth } from './contexts/AuthContext';

// Export subscription functions
export { 
  createTrialSubscription,
  checkSubscriptionStatus,
} from './services/subscription';

// Export types
export type { UserSubscription, SubscriptionStatus } from './types/subscription';

// Export Supabase client
export { supabase } from './supabaseClient';

// Export services
export * from './services/database';
export * from './services/documentClient';
export * from './services/userAccess';
