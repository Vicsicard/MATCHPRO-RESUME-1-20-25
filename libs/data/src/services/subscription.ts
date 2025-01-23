import { supabase } from '../supabaseClient';
import { UserSubscription, SubscriptionStatus } from '../types/subscription';

const TRIAL_DURATION_DAYS = 14; // 14-day trial period

export async function createTrialSubscription(userId: string): Promise<UserSubscription> {
  try {
    console.log('subscription.ts - Creating trial subscription for user:', userId);
    
    // First check if user already has a subscription
    const { data: existingSubscription, error: checkError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('subscription.ts - Error checking existing subscription:', checkError);
      throw checkError;
    }

    if (existingSubscription) {
      console.log('subscription.ts - User already has a subscription:', existingSubscription);
      return existingSubscription as UserSubscription;
    }

    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);

    console.log('subscription.ts - Creating new trial subscription with end date:', trialEndsAt);

    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        status: 'TRIAL',
        trial_ends_at: trialEndsAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('subscription.ts - Error creating trial subscription:', error);
      throw error;
    }

    if (!data) {
      console.error('subscription.ts - No data returned after creating subscription');
      throw new Error('Failed to create trial subscription');
    }

    console.log('subscription.ts - Trial subscription created successfully:', data);
    return data as UserSubscription;
  } catch (error) {
    console.error('subscription.ts - Unexpected error in createTrialSubscription:', error);
    throw error;
  }
}

export async function checkSubscriptionStatus(userId: string): Promise<{
  isValid: boolean;
  status: SubscriptionStatus;
  expiresAt: Date | null;
}> {
  try {
    console.log('subscription.ts - Checking subscription status for user:', userId);

    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('subscription.ts - Error fetching subscription:', error);
      throw error;
    }

    if (!subscription) {
      console.log('subscription.ts - No subscription found for user');
      return { isValid: false, status: 'EXPIRED', expiresAt: null };
    }

    console.log('subscription.ts - Found subscription:', subscription);

    const now = new Date();
    const trialEndsAt = subscription.trial_ends_at ? new Date(subscription.trial_ends_at) : null;
    const currentPeriodEndsAt = subscription.current_period_ends_at ? new Date(subscription.current_period_ends_at) : null;

    // Check trial status
    if (subscription.status === 'TRIAL' && trialEndsAt) {
      if (now < trialEndsAt) {
        console.log('subscription.ts - Trial is still valid, expires:', trialEndsAt);
        return { isValid: true, status: 'TRIAL', expiresAt: trialEndsAt };
      }
      console.log('subscription.ts - Trial has expired on:', trialEndsAt);
      
      // Update status to EXPIRED
      await supabase
        .from('user_subscriptions')
        .update({ status: 'EXPIRED' })
        .eq('id', subscription.id);
        
      return { isValid: false, status: 'EXPIRED', expiresAt: null };
    }

    // Check active subscription
    if (subscription.status === 'ACTIVE' && currentPeriodEndsAt) {
      if (now < currentPeriodEndsAt) {
        console.log('subscription.ts - Subscription is active, expires:', currentPeriodEndsAt);
        return { isValid: true, status: 'ACTIVE', expiresAt: currentPeriodEndsAt };
      }
      console.log('subscription.ts - Subscription has expired on:', currentPeriodEndsAt);
      
      // Update status to EXPIRED
      await supabase
        .from('user_subscriptions')
        .update({ status: 'EXPIRED' })
        .eq('id', subscription.id);
    }

    return { isValid: false, status: 'EXPIRED', expiresAt: null };
  } catch (error) {
    console.error('subscription.ts - Error checking subscription status:', error);
    throw error;
  }
}

export async function updateSubscriptionStatus(
  userId: string,
  status: SubscriptionStatus,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
  currentPeriodEndsAt?: Date
): Promise<UserSubscription> {
  try {
    console.log('subscription.ts - Updating subscription for user:', userId);

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (stripeCustomerId) {
      updateData.stripe_customer_id = stripeCustomerId;
    }

    if (stripeSubscriptionId) {
      updateData.stripe_subscription_id = stripeSubscriptionId;
    }

    if (currentPeriodEndsAt) {
      updateData.current_period_ends_at = currentPeriodEndsAt.toISOString();
    }

    const { data, error } = await supabase
      .from('user_subscriptions')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('subscription.ts - Error updating subscription:', error);
      throw error;
    }

    if (!data) {
      console.error('subscription.ts - No data returned after updating subscription');
      throw new Error('Failed to update subscription');
    }

    console.log('subscription.ts - Subscription updated successfully:', data);
    return data as UserSubscription;
  } catch (error) {
    console.error('subscription.ts - Error updating subscription status:', error);
    throw error;
  }
}
