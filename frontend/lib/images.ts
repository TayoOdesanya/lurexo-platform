// frontend/lib/images.ts

import { API_BASE_URL } from "@/lib/api";

export function resolveEventImageSrc(value?: string | null): string | undefined {
  if (!value) return undefined;

  const v = String(value).trim();
  if (!v) return undefined;

  // Allow absolute URLs (legacy seeded data, external, etc.)
  if (/^https?:\/\//i.test(v)) return v;

  // Allow root-relative paths (e.g. /events/... used by some seeds)
  if (v.startsWith("/")) return v;

  // Provider-neutral backend image endpoint
  return `${API_BASE_URL}/images?key=${encodeURIComponent(v)}`;
}
