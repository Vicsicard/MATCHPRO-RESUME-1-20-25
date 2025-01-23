export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED';

export interface UserSubscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  trial_ends_at: string;
  current_period_ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionCheck {
  isValid: boolean;
  status: SubscriptionStatus;
  expiresAt: Date | null;
}
