'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getApiBaseUrl } from "@/lib/apiBase";

const API_BASE_URL = getApiBaseUrl();

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  emailVerified: boolean;
  role?: string;
}

type AuthResult = { success: boolean; message?: string };

type SignupResult = AuthResult & {
  verificationToken?: string; // ✅ dev-only: returned by backend register (Option A)
};

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string, name: string) => Promise<SignupResult>;
  logout: () => Promise<void>;

  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (token: string, password: string) => Promise<AuthResult>;

  verifyEmail: (token: string) => Promise<AuthResult>;
  resendVerificationEmail: () => Promise<AuthResult>;

  updateProfile: (data: Partial<User>) => Promise<AuthResult>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function saveAuth(accessToken: string, refreshToken: string, user: User) {
  localStorage.setItem('authToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('userData', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userData');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const cachedUser = safeJsonParse<User>(localStorage.getItem('userData'));

      if (!token) {
        setUser(null);
        return;
      }

      // If we have cached user, show it immediately while we validate in background
      if (cachedUser) setUser(cachedUser);

      // Validate token with backend
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const me = await res.json();

        const normalized: User = {
          id: me.id,
          email: me.email,
          name:
            [me.firstName, me.lastName].filter(Boolean).join(' ') ||
            me.name ||
            me.email?.split('@')?.[0] ||
            'User',
          phone: me.phoneNumber ?? me.phone,
          createdAt: me.createdAt,
          emailVerified: !!me.emailVerified,
          role: me.role,
        };

        localStorage.setItem('userData', JSON.stringify(normalized));
        setUser(normalized);
        return;
      }

      // If access token expired, try refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        clearAuth();
        setUser(null);
        return;
      }

      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        clearAuth();
        setUser(null);
        return;
      }

      const refreshed = await refreshRes.json();
      if (refreshed?.accessToken) localStorage.setItem('authToken', refreshed.accessToken);
      if (refreshed?.refreshToken) localStorage.setItem('refreshToken', refreshed.refreshToken);

      // Try /me again after refresh
      const me2Res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      if (!me2Res.ok) {
        clearAuth();
        setUser(null);
        return;
      }

      const me2 = await me2Res.json();
      const normalized2: User = {
        id: me2.id,
        email: me2.email,
        name:
          [me2.firstName, me2.lastName].filter(Boolean).join(' ') ||
          me2.name ||
          me2.email?.split('@')?.[0] ||
          'User',
        phone: me2.phoneNumber ?? me2.phone,
        createdAt: me2.createdAt,
        emailVerified: !!me2.emailVerified,
        role: me2.role,
      };

      localStorage.setItem('userData', JSON.stringify(normalized2));
      setUser(normalized2);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Don’t hard logout on transient errors
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        return { success: false, message: txt || 'Login failed. Please check your credentials.' };
      }

      const data = await res.json();

      // Expected shape:
      // { user: { id,email,firstName,lastName,role,emailVerified }, accessToken, refreshToken }
      const u = data.user;

      const normalized: User = {
        id: u.id,
        email: u.email,
        name:
          [u.firstName, u.lastName].filter(Boolean).join(' ') ||
          u.name ||
          u.email?.split('@')?.[0] ||
          'User',
        createdAt: u.createdAt || new Date().toISOString(),
        emailVerified: !!u.emailVerified,
        role: u.role,
      };

      saveAuth(data.accessToken, data.refreshToken, normalized);
      setUser(normalized);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<SignupResult> => {
    try {
      // Backend expects: { email, password, firstName, lastName, role? }
      // Your UI uses a single "name" field, so split it.
      const trimmed = name.trim();
      const parts = trimmed.split(/\s+/).filter(Boolean);
      const firstName = parts[0] || trimmed || 'User';
      const lastName = parts.slice(1).join(' ') || 'User';

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          // role: 'BUYER', // optional
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        return { success: false, message: txt || 'Signup failed. This email may already be registered.' };
      }

      const data = await res.json();
      // Expected shape currently:
      // { message, user, verificationToken? }  (verificationToken only in dev if you add Option A)
      const verificationToken: string | undefined =
        data.verificationToken ?? data?.user?.verificationToken;

      // We don't log the user in automatically on signup (keeps flow clean for verification)
      // But we can store a light "pending user" record for UI continuity if you want.
      // For now, do nothing except return token.

      return {
        success: true,
        message: data.message || 'Account created! Please verify your email.',
        verificationToken,
      };
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, message: 'Signup failed. Please try again.' };
    }
  };

const logout = async () => {
  try {
    clearAuth();
    setUser(null);
    // Don't navigate here - let the caller decide where to go
  } catch (error) {
    console.error('Logout failed:', error);
  }
};


  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // This endpoint intentionally returns success even if email doesn't exist
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        return { success: false, message: txt || 'Failed to send reset email. Please try again.' };
      }

      const data = await res.json().catch(() => ({}));
      return { success: true, message: data.message || 'If the email exists, a reset link has been sent.' };
    } catch (error) {
      console.error('Reset password failed:', error);
      return { success: false, message: 'Failed to send reset email. Please try again.' };
    }
  };

  const updatePassword = async (token: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        return { success: false, message: txt || 'Failed to update password. Link may have expired.' };
      }

      const data = await res.json().catch(() => ({}));
      return { success: true, message: data.message || 'Password updated successfully!' };
    } catch (error) {
      console.error('Update password failed:', error);
      return { success: false, message: 'Failed to update password. Please try again.' };
    }
  };

  const verifyEmail = async (token: string): Promise<AuthResult> => {
    try {
      // Backend uses GET /auth/verify-email/:token
      const res = await fetch(`${API_BASE_URL}/auth/verify-email/${encodeURIComponent(token)}`, {
        method: 'GET',
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        return { success: false, message: txt || 'Email verification failed. Link may have expired.' };
      }

      const data = await res.json().catch(() => ({}));

      // If user is logged in, update local flag
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }

      return { success: true, message: data.message || 'Email verified successfully!' };
    } catch (error) {
      console.error('Verify email failed:', error);
      return { success: false, message: 'Email verification failed. Please try again.' };
    }
  };

  const resendVerificationEmail = async (): Promise<AuthResult> => {
    // You do not currently have a backend endpoint for this.
    // Keeping as a friendly placeholder for now.
    return {
      success: false,
      message: 'Resend verification is not implemented yet.',
    };
  };

  const updateProfile = async (data: Partial<User>): Promise<AuthResult> => {
    try {
      // No backend endpoint shown for profile updates; keep local update for now.
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
      return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
      console.error('Update profile failed:', error);
      return { success: false, message: 'Failed to update profile.' };
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
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
      checkAuth,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
