import { NextResponse } from "next/server";
import { getServerApiBaseUrl } from "@/lib/serverApiBase";

export const runtime = "nodejs";

export async function GET() {
  try {
    const API_BASE_URL = getServerApiBaseUrl();

    const upstream = await fetch(`${API_BASE_URL}/events`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    const contentType =
      upstream.headers.get("content-type") || "application/json";
    const raw = await upstream.text();

    return new NextResponse(raw, {
      status: upstream.status,
      headers: { "content-type": contentType },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Failed to proxy /events to backend",
        message: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
