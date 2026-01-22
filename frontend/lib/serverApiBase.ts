// lib/serverApiBase.ts
export function getServerApiBaseUrl() {
  const base = process.env.API_BASE_URL || "http://localhost:3001/api";
  return base.replace(/\/+$/, "");
}
