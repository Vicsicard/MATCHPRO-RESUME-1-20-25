// Mock auth service for development
import type { User } from '../types';

let currentUser: User | null = null;

export async function signUp(email: string, password: string) {
  currentUser = {
    id: '1',
    email,
    full_name: email.split('@')[0],
  };
  return { user: currentUser };
}

export async function signIn(email: string, password: string) {
  currentUser = {
    id: '1',
    email,
    full_name: email.split('@')[0],
  };
  return { user: currentUser };
}

export async function signOut() {
  currentUser = null;
}

export async function resetPassword(email: string) {
  // Mock implementation
}

export async function updatePassword(newPassword: string) {
  // Mock implementation
}

export async function getCurrentUser(): Promise<User | null> {
  return currentUser;
}
