export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface SubscriptionStatus {
  status: 'TRIAL' | 'ACTIVE' | 'EXPIRED';
  expiresAt: Date | null;
}

// Mock authentication for now
let currentUser: User | null = null;

// Mock subscription data
const mockSubscriptions: Record<string, SubscriptionStatus> = {};

export async function signIn(email: string, password: string): Promise<void> {
  // Mock successful sign in
  currentUser = {
    id: '1',
    email,
  };
  
  // Set up trial subscription for new users
  if (!mockSubscriptions[currentUser.id]) {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial
    mockSubscriptions[currentUser.id] = {
      status: 'TRIAL',
      expiresAt: trialEnd,
    };
  }
}

export async function signUp(email: string, password: string): Promise<void> {
  // Mock successful sign up
  currentUser = {
    id: '1',
    email,
  };

  // Set up trial subscription for new users
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial
  mockSubscriptions[currentUser.id] = {
    status: 'TRIAL',
    expiresAt: trialEnd,
  };
}

export async function signOut(): Promise<void> {
  currentUser = null;
}

export async function getCurrentUser(): Promise<User | null> {
  return currentUser;
}

export async function checkSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  // If no subscription exists, create a trial subscription
  if (!mockSubscriptions[userId]) {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial
    mockSubscriptions[userId] = {
      status: 'TRIAL',
      expiresAt: trialEnd,
    };
  }
  
  return mockSubscriptions[userId];
}
