import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create client with service role key for admin operations
const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase credentials. Please check your environment variables.');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
};

export type AccessType = 'free' | 'paid';

export interface UserAccess {
  user_id: string;
  access_type: AccessType;
  access_start: string;
  access_end: string;
  payment_id?: string;
  amount_paid?: number;
  status: 'active' | 'expired';
}

export async function createFreeAccess(userId: string): Promise<UserAccess | null> {
  try {
    const supabase = getSupabaseClient();
    const now = new Date();
    const accessEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    const access: UserAccess = {
      user_id: userId,
      access_type: 'free',
      access_start: now.toISOString(),
      access_end: accessEnd.toISOString(),
      status: 'active',
    };

    const { data, error } = await supabase
      .from('user_access')
      .insert(access)
      .select()
      .single();

    if (error) {
      console.error('Error creating free access:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createFreeAccess:', error);
    return null;
  }
}

export async function createPaidAccess(
  userId: string,
  paymentId: string,
  amountPaid: number
): Promise<UserAccess | null> {
  try {
    const supabase = getSupabaseClient();
    const now = new Date();
    const accessEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const access: UserAccess = {
      user_id: userId,
      access_type: 'paid',
      access_start: now.toISOString(),
      access_end: accessEnd.toISOString(),
      payment_id: paymentId,
      amount_paid: amountPaid,
      status: 'active',
    };

    const { data, error } = await supabase
      .from('user_access')
      .insert(access)
      .select()
      .single();

    if (error) {
      console.error('Error creating paid access:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createPaidAccess:', error);
    return null;
  }
}

export async function getCurrentAccess(userId: string): Promise<UserAccess | null> {
  try {
    const supabase = getSupabaseClient();
    const now = new Date().toISOString();

    // Get the most recent active access for the user
    const { data, error } = await supabase
      .from('user_access')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .lte('access_start', now)
      .gte('access_end', now)
      .order('access_end', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // no rows returned
        return null;
      }
      console.error('Error getting current access:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCurrentAccess:', error);
    return null;
  }
}

export async function hasActiveAccess(userId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('user_access')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking user access:', error);
      return false;
    }

    return !!data && new Date(data.access_end) > new Date();
  } catch (error) {
    console.error('Error in hasActiveAccess:', error);
    return false;
  }
}

export async function expireAccess(userId: string, accessId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('user_access')
      .update({ status: 'expired' })
      .eq('user_id', userId)
      .eq('id', accessId);

    if (error) {
      console.error('Error expiring access:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in expireAccess:', error);
    return false;
  }
}

// Check if user is eligible for free trial (hasn't used it before)
export async function isEligibleForFreeTrial(userId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('user_access')
      .select('*')
      .eq('user_id', userId)
      .eq('access_type', 'free')
      .limit(1);

    if (error) {
      console.error('Error checking free trial eligibility:', error);
      return false;
    }

    return data.length === 0;
  } catch (error) {
    console.error('Error in isEligibleForFreeTrial:', error);
    return false;
  }
}
