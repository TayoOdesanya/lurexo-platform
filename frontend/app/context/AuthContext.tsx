'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

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
  verificationToken?: string; // dev-only if backend returns it
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

// Always call relative Next API routes (server proxies to backend)
const AUTH_API = '/api/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeUser = (me: any): User => ({
    id: me.id,
    email: me.email,
    name:
      [me.firstName, me.lastName].filter(Boolean).join(' ') ||
      me.name ||
      me.email?.split('@')?.[0] ||
      'User',
    phone: me.phoneNumber ?? me.phone,
    createdAt: me.createdAt || new Date().toISOString(),
    emailVerified: !!me.emailVerified,
    role: me.role,
  });

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const cachedUser = safeJsonParse<User>(localStorage.getItem('userData'));

      if (!token) {
        setUser(null);
        return;
      }

      if (cachedUser) setUser(cachedUser);

      // Validate token
      const res = await fetch(`${AUTH_API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const me = await res.json();
        const normalized = normalizeUser(me);
        localStorage.setItem('userData', JSON.stringify(normalized));
        setUser(normalized);
        return;
      }

      // Try refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        clearAuth();
        setUser(null);
        return;
      }

      const refreshRes = await fetch(`${AUTH_API}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        clearAuth();
        setUser(null);
        return;
      }

      const refreshed = await refreshRes.json().catch(() => ({}));
      if (refreshed?.accessToken) localStorage.setItem('authToken', refreshed.accessToken);
      if (refreshed?.refreshToken) localStorage.setItem('refreshToken', refreshed.refreshToken);

      const token2 = localStorage.getItem('authToken');
      if (!token2) {
        clearAuth();
        setUser(null);
        return;
      }

      const me2Res = await fetch(`${AUTH_API}/me`, {
        headers: { Authorization: `Bearer ${token2}` },
      });

      if (!me2Res.ok) {
        clearAuth();
        setUser(null);
        return;
      }

      const me2 = await me2Res.json();
      const normalized2 = normalizeUser(me2);
      localStorage.setItem('userData', JSON.stringify(normalized2));
      setUser(normalized2);
    } catch (error) {
      console.error('Auth check failed:', error);
      // don’t hard logout on transient errors
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${AUTH_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        return { success: false, message: txt || 'Login failed. Please check your credentials.' };
      }

      const data = await res.json().catch(() => ({}));
      const u = data.user;

      if (!data.accessToken || !data.refreshToken || !u) {
        return { success: false, message: 'Login failed: unexpected response.' };
      }

      const normalized: User = normalizeUser(u);

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
      const trimmed = name.trim();
      const parts = trimmed.split(/\s+/).filter(Boolean);
      const firstName = parts[0] || trimmed || 'User';
      const lastName = parts.slice(1).join(' ') || 'User';

      const res = await fetch(`${AUTH_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        return { success: false, message: txt || 'Signup failed. This email may already be registered.' };
      }

      const data = await res.json().catch(() => ({}));
      const verificationToken: string | undefined =
        data.verificationToken ?? data?.user?.verificationToken;

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
    clearAuth();
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${AUTH_API}/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

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
      const res = await fetch(`${AUTH_API}/reset-password`, {
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
      const res = await fetch(`${AUTH_API}/verify-email/${encodeURIComponent(token)}`, {
        method: 'GET',
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        return { success: false, message: txt || 'Email verification failed. Link may have expired.' };
      }

      const data = await res.json().catch(() => ({}));

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
    // No backend endpoint currently
    return { success: false, message: 'Resend verification is not implemented yet.' };
  };

  const updateProfile = async (data: Partial<User>): Promise<AuthResult> => {
    try {
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
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}