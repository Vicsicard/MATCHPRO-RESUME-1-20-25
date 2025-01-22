export interface User {
  id: string;
  email: string;
  name?: string;
}

// Mock authentication for now
let currentUser: User | null = null;

export async function signIn(email: string, password: string): Promise<void> {
  // Mock successful sign in
  currentUser = {
    id: '1',
    email,
  };
}

export async function signUp(email: string, password: string): Promise<void> {
  // Mock successful sign up
  currentUser = {
    id: '1',
    email,
  };
}

export async function signOut(): Promise<void> {
  currentUser = null;
}

export async function getCurrentUser(): Promise<User | null> {
  return currentUser;
}
