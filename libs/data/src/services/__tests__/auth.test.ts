import { signIn, signUp, signOut, getCurrentUser } from '../auth';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('auth service', () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    // Setup mock Supabase client
    mockSupabaseClient = {
      auth: {
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        getSession: jest.fn(),
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  describe('signIn', () => {
    it('should successfully sign in user', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const result = await signIn('test@example.com', 'password');

      expect(result).toEqual({ user: mockUser });
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    it('should handle sign in error', async () => {
      const error = new Error('Invalid credentials');
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error,
      });

      await expect(signIn('test@example.com', 'password')).rejects.toThrow(error);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from session', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
        data: { session: { user: mockUser } },
        error: null,
      });

      const user = await getCurrentUser();

      expect(user).toEqual(mockUser);
      expect(mockSupabaseClient.auth.getSession).toHaveBeenCalled();
    });

    it('should return null when no session exists', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      const user = await getCurrentUser();

      expect(user).toBeNull();
    });

    it('should handle get session error', async () => {
      const error = new Error('Failed to get session');
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error,
      });

      await expect(getCurrentUser()).rejects.toThrow(error);
    });
  });
});
