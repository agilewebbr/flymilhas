import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabaseClient'

// Mock Supabase
jest.mock('@/lib/supabaseClient')

const mockedSupabase = supabase as jest.Mocked<typeof supabase>

// Test component to use the hook
function TestComponent() {
  const { user, profile, loading, signIn, signUp, signOut } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{user ? user.email : 'null'}</div>
      <div data-testid="profile">{profile ? profile.name : 'null'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={() => signUp('test@example.com', 'password', 'Test User', 'gestor')}>
        Sign Up
      </button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementations
    mockedSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })
    
    mockedSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } }
    })
  })

  it('should render children and provide auth context', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByTestId('user')).toBeInTheDocument()
    expect(screen.getByTestId('profile')).toBeInTheDocument()
  })

  it('should initialize with loading state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(screen.getByTestId('profile')).toHaveTextContent('null')
  })

  it('should handle user session correctly', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }

    const mockSession = {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: mockUser
    }

    const mockProfile = {
      user_id: 'user-123',
      name: 'Test User',
      role: 'gestor' as const,
      phone: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }

    mockedSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    })

    mockedSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    } as any)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    expect(screen.getByTestId('profile')).toHaveTextContent('Test User')
  })

  it('should handle sign in', async () => {
    mockedSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signInButton = screen.getByText('Sign In')
    signInButton.click()

    await waitFor(() => {
      expect(mockedSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      })
    })
  })

  it('should handle sign up', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }

    mockedSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null
    })

    mockedSupabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({
        data: null,
        error: null
      })
    } as any)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signUpButton = screen.getByText('Sign Up')
    signUpButton.click()

    await waitFor(() => {
      expect(mockedSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      })
    })

    await waitFor(() => {
      expect(mockedSupabase.from).toHaveBeenCalledWith('profiles')
    })
  })

  it('should handle sign out', async () => {
    mockedSupabase.auth.signOut.mockResolvedValue({ error: null })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signOutButton = screen.getByText('Sign Out')
    signOutButton.click()

    await waitFor(() => {
      expect(mockedSupabase.auth.signOut).toHaveBeenCalled()
    })
  })

  it('should handle auth state changes', async () => {
    const mockCallback = jest.fn()
    
    mockedSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
      mockCallback.mockImplementation(callback)
      return {
        data: { subscription: { unsubscribe: jest.fn() } }
      }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(mockedSupabase.auth.onAuthStateChange).toHaveBeenCalled()
  })

  it('should throw error when useAuth is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = jest.fn()

    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within AuthProvider'
    )

    console.error = originalError
  })
})