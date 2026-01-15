import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

export async function GET() {
  const upstream = await fetch(`${API_BASE_URL}/events`, { cache: "no-store" });

  const contentType = upstream.headers.get("content-type") || "application/json";
  const raw = await upstream.text();

  return new NextResponse(raw, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}
