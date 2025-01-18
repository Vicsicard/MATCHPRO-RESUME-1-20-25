export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  content: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  resume_id: string;
  company: string;
  position: string;
  job_description: string;
  status: 'draft' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface OptimizationResult {
  id: string;
  user_id: string;
  resume_id: string;
  job_application_id: string;
  original_content: string;
  optimized_content: string;
  match_score?: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan_type: 'free' | 'basic' | 'premium';
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  created_at: string;
  updated_at: string;
}
