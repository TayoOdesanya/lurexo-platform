'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  emailVerified: boolean;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    darkMode: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  updatePassword: (token: string, password: string) => Promise<{ success: boolean; message?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; message?: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      // In production, validate token with backend
      // For now, check if user data exists
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // In production, call your backend API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });

      // Mock successful login for demo
      const mockUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
        emailVerified: true,
        preferences: {
          notifications: true,
          newsletter: false,
          darkMode: true
        }
      };

      // Store auth data
      localStorage.setItem('authToken', 'mock_token_' + Date.now());
      localStorage.setItem('userData', JSON.stringify(mockUser));
      
      setUser(mockUser);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: 'Login failed. Please check your credentials.' 
      };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // In production, call your backend API
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name })
      // });

      // Mock successful signup for demo
      const mockUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        preferences: {
          notifications: true,
          newsletter: true,
          darkMode: true
        }
      };

      // Store auth data
      localStorage.setItem('authToken', 'mock_token_' + Date.now());
      localStorage.setItem('userData', JSON.stringify(mockUser));
      
      setUser(mockUser);
      
      return { 
        success: true,
        message: 'Account created! Please check your email to verify your account.'
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Signup failed. This email may already be registered.' 
      };
    }
  };

  const logout = async () => {
    try {
      // Clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // In production, call your backend API
      // await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      return { 
        success: true,
        message: 'Password reset link sent! Check your email.'
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to send reset email. Please try again.' 
      };
    }
  };

  const updatePassword = async (token: string, password: string) => {
    try {
      // In production, call your backend API
      return { 
        success: true,
        message: 'Password updated successfully!'
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to update password. Link may have expired.' 
      };
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      // In production, call your backend API
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
      
      return { 
        success: true,
        message: 'Email verified successfully!'
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Email verification failed. Link may have expired.' 
      };
    }
  };

  const resendVerificationEmail = async () => {
    try {
      // In production, call your backend API
      return { 
        success: true,
        message: 'Verification email sent! Check your inbox.'
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to send verification email.' 
      };
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      // In production, call your backend API
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
      
      return { 
        success: true,
        message: 'Profile updated successfully!'
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to update profile.' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      resetPassword,
      updatePassword,
      verifyEmail,
      resendVerificationEmail,
      updateProfile,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
}