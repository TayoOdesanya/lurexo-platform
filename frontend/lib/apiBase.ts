// lib/apiBase.ts
export function getApiBaseUrl() {
  // NEXT_PUBLIC_* is available in the browser (baked at build time)
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    // Keep this loud so you notice immediately if env isn't set
    throw new Error(
      "Missing NEXT_PUBLIC_API_BASE_URL (or NEXT_PUBLIC_API_URL). Set it in GitHub Actions build env."
    );
  }

  // ensure no trailing slash
  return base.replace(/\/+$/, "");
}
