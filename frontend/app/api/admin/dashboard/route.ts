import { getServerApiBaseUrl } from "@/lib/serverApiBase";

export async function GET(req: Request) {
  const incomingUrl = new URL(req.url);
  const upstreamBase = getServerApiBaseUrl();
  const upstreamUrl = new URL(`${upstreamBase}/admin/dashboard`);
  upstreamUrl.search = incomingUrl.search;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  const upstreamRes = await fetch(upstreamUrl.toString(), {
    method: "GET",
    headers,
    redirect: "manual",
  });

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
