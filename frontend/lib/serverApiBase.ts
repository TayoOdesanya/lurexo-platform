export function getServerApiBaseUrl() {
  const raw =
    process.env.API_BASE_URL ||
    process.env.APPSETTING_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.APPSETTING_NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.APPSETTING_NEXT_PUBLIC_API_URL;

  // Local dev fallback (only if env var isn't set)
  const origin = (raw && raw.trim().length > 0) ? raw.trim() : "http://localhost:3001";

  // Normalize: remove trailing slashes
  const base = origin.replace(/\/+$/, "");

  // Ensure exactly one /api at the end
  return base.endsWith("/api") ? base : `${base}/api`;
}
