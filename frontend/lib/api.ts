// frontend/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "include", // safe even if you don't use cookies
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}${body ? `: ${body}` : ""}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ---- Types (loose on purpose because your list page suggests the API returns computed fields like location, capacity, etc.)
export type ApiEvent = {
  id: string;
  title?: string;
  description?: string;
  category?: string;

  // list page fields (already working)
  location?: string;
  ticketPrice?: number | string;
  serviceFee?: number | string;
  ticketsSold?: number;
  capacity?: number;

  // prisma-ish fields
  venue?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;

  heroImage?: string;
  imageUrl?: string;
  galleryImages?: string[];

  eventDate?: string;
  doorsOpen?: string | null;
  eventEnd?: string | null;

  status?: string; // DRAFT/PUBLISHED etc

  allowResale?: boolean;
  resaleCapValue?: number | null;

  organizer?: {
    name?: string;
    username?: string;
    avatar?: string;
    verified?: boolean;
  };

  // if API includes tiers relation
  ticketTiers?: Array<{
    id: string;
    name: string;
    description?: string | null;
    price: number; // likely pence if prisma
    quantity: number;
    quantitySold: number;
  }>;
};

export async function fetchEvents(): Promise<ApiEvent[]> {
  const url = `${API_BASE_URL}/events`;
  console.log("Fetching:", url);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Failed to fetch events (${response.status}): ${body}`);
  }
  return response.json();
}

// ---- CRUD
export const EventsApi = {
  list: () => request<ApiEvent[]>("/events"),

  getById: (id: string) => request<ApiEvent>(`/events/${id}`),

  // Update event (draft edits). Payload depends on your backend DTO.
  update: (id: string, payload: Partial<ApiEvent>) =>
    request<ApiEvent>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  patch: (id: string, payload: Partial<ApiEvent>) =>
    request<ApiEvent>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  // Publish: use your actual backend route if different
  publish: (id: string) =>
    request<ApiEvent>(`/events/${id}/publish`, {
      method: "POST",
    }),

  delete: (id: string) =>
    request<void>(`/events/${id}`, {
      method: "DELETE",
    }),
};
