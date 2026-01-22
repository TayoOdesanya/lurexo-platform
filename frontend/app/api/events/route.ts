import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/apiBase";

export const runtime = "nodejs";

export async function GET() {
  const API_BASE_URL = getApiBaseUrl();

  const upstream = await fetch(`${API_BASE_URL}/events`, { cache: "no-store" });

  const contentType = upstream.headers.get("content-type") || "application/json";
  const raw = await upstream.text();

  return new NextResponse(raw, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}