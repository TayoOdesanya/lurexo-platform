import { NextResponse } from "next/server";
import { getServerApiBaseUrl } from "@/lib/serverApiBase";

export async function POST(req: Request) {
  const body = await req.json();

  const upstream = await fetch(`${getServerApiBaseUrl()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();

  // Preserve backend status + payload
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
