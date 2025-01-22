import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../AuthContext';
import { signIn, signUp, signOut, getCurrentUser } from '@matchpro/data';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock @matchpro/data
jest.mock('@matchpro/data', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
}));

// Test component that uses auth context
function TestComponent() {
  const { user, loading, signIn: handleSignIn } = useAuth();
  return (
    <div>
      {loading && <div>Loading...</div>}
      {user && <div>User: {user.email}</div>}
      <button onClick={() => handleSignIn('test@example.com', 'password')}>Sign In</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should check user on mount', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Should show user email after loading
    await waitFor(() => {
      expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
    });

    // Should have called getCurrentUser
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('should handle sign in', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    (signIn as jest.Mock).mockResolvedValueOnce({ user: mockUser });
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click sign in button
    fireEvent.click(screen.getByText('Sign In'));

    // Should call signIn with correct credentials
    expect(signIn).toHaveBeenCalledWith('test@example.com', 'password');

    // Should show user email after sign in
    await waitFor(() => {
      expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
    });
  });

  it('should handle sign in error', async () => {
    const error = new Error('Invalid credentials');
    (signIn as jest.Mock).mockRejectedValueOnce(error);
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click sign in button
    fireEvent.click(screen.getByText('Sign In'));

    // Should call signIn
    expect(signIn).toHaveBeenCalledWith('test@example.com', 'password');

    // Should not show user email
    await waitFor(() => {
      expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
    });
  });
});
