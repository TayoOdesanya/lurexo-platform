// frontend/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Base JSON request helper (no auth header).
 */
async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}${body ? `: ${body}` : ""}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * JSON request helper that adds Authorization: Bearer <token>
 */
export async function apiRequestAuth<T>(
  path: string,
  accessToken: string,
  init?: RequestInit
): Promise<T> {
  return apiRequest<T>(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// -------------------------
// AUTH API (NestJS)
// -------------------------

export type AuthUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
  emailVerified?: boolean;
};

export type RegisterResponse = {
  message: string;
  user: AuthUser;
};

export type LoginResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export const AuthApi = {
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) =>
    apiRequest<RegisterResponse>(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    apiRequest<LoginResponse>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  refresh: (payload: { refreshToken: string }) =>
    apiRequest<RefreshResponse>(`/auth/refresh`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: (accessToken: string) => apiRequestAuth<AuthUser>(`/auth/me`, accessToken),
};

// -------------------------
// EVENTS API (keep your existing fetchEvents)
// -------------------------

export async function fetchEvents() {
  console.log("API_BASE_URL:", API_BASE_URL);
  const url = `${API_BASE_URL}/events`;
  console.log("Fetching:", url);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Failed to fetch events (${response.status}): ${body}`);
  }
  return response.json();
}
