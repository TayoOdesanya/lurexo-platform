import { getServerApiBaseUrl } from "@/lib/serverApiBase";

/**
 * Proxies ALL /api/auth/* requests to your backend /api/auth/* endpoint.
 *
 * Example:
 *   Frontend calls:  /api/auth/login
 *   Proxy forwards:  <API_BASE_URL>/api/auth/login   (because getServerApiBaseUrl() ends with /api)
 */
async function handler(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await ctx.params;

  // Build upstream URL (preserve query string)
  const incomingUrl = new URL(req.url);
  const upstreamBase = getServerApiBaseUrl(); // e.g. https://backend.../api
  const upstreamUrl = new URL(`${upstreamBase}/auth/${path.join("/")}`);
  upstreamUrl.search = incomingUrl.search; // keep ?x=y

  // Copy headers, but avoid hop-by-hop headers
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  // Forward body for non-GET/HEAD
  const method = req.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstreamRes = await fetch(upstreamUrl.toString(), {
    method,
    headers,
    body,
    redirect: "manual",
  });

  // Return upstream response (copy headers safely)
  const resHeaders = new Headers(upstreamRes.headers);
  resHeaders.delete("content-encoding");
  resHeaders.delete("content-length");
  resHeaders.delete("transfer-encoding");
  resHeaders.delete("connection");

  const resBody = await upstreamRes.arrayBuffer();

  return new Response(resBody, {
    status: upstreamRes.status,
    headers: resHeaders,
  });
}

// Support all common methods
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;