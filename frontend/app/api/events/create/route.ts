import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

function getBearerToken(req: Request): string {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth) throw new Error("Unauthenticated");
  const [scheme, token] = auth.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) throw new Error("Unauthenticated");
  return token;
}

function mapCategory(uiCategory: string): string {
  const v = (uiCategory || "").toLowerCase();
  switch (v) {
    case "music":
      return "MUSIC";
    case "sports":
      return "SPORTS";
    case "arts":
      return "ARTS";
    case "comedy":
      return "COMEDY";
    case "theatre":
    case "theater":
      return "THEATER";
    case "business":
      return "CONFERENCE";
    case "food":
      return "OTHER";
    case "other":
    default:
      return "OTHER";
  }
}

function toIsoEventDate(eventDate: string, eventTime: string): string {
  // eventDate: "2026-03-08", eventTime: "10:15"
  const d = new Date(`${eventDate}T${eventTime || "00:00"}:00`);
  return d.toISOString();
}

export async function POST(req: Request) {
  try {
    const accessToken = getBearerToken(req);

    const incoming = await req.formData();

    // Read UI fields
    const eventName = String(incoming.get("eventName") ?? "");
    const categoryUi = String(incoming.get("category") ?? "");
    const shortDescription = String(incoming.get("shortDescription") ?? "");
    const longDescription = String(incoming.get("longDescription") ?? "");
    const eventDate = String(incoming.get("eventDate") ?? "");
    const eventTime = String(incoming.get("eventTime") ?? "");
    const venue = String(incoming.get("venue") ?? "");
    const address = String(incoming.get("address") ?? "");
    const city = String(incoming.get("city") ?? "");
    const postcode = String(incoming.get("postcode") ?? "");
    const status = String(incoming.get("status") ?? "DRAFT");
    const totalCapacityStr = String(incoming.get("totalCapacity") ?? "");

    // Minimal early checks (optional; keeps UI errors nice)
    if (!eventName.trim()) return NextResponse.json({ error: "eventName is required" }, { status: 400 });
    if (!categoryUi) return NextResponse.json({ error: "category is required" }, { status: 400 });
    if (!shortDescription.trim()) return NextResponse.json({ error: "shortDescription is required" }, { status: 400 });
    if (!eventDate) return NextResponse.json({ error: "eventDate is required" }, { status: 400 });

    const mappedCategory = mapCategory(categoryUi);
    const isoEventDate = toIsoEventDate(eventDate, eventTime);

    // Required by CreateEventDto
    const saleStartDate = new Date().toISOString();
    const saleEndDate = isoEventDate;

    const totalCapacity = Number.parseInt(totalCapacityStr || "100", 10);
    const safeCapacity = Number.isFinite(totalCapacity) ? totalCapacity : 100;

    // Build DTO-shaped multipart payload for NestJS
    const fd = new FormData();
    fd.append("title", eventName);
    fd.append("description", (longDescription || shortDescription).trim());
    fd.append("category", mappedCategory);
    fd.append("venue", venue);
    fd.append("address", address);
    fd.append("city", city);
    fd.append("country", "United Kingdom");
    fd.append("postalCode", postcode);
    fd.append("eventDate", isoEventDate);
    fd.append("saleStartDate", saleStartDate);
    fd.append("saleEndDate", saleEndDate);
    fd.append("totalCapacity", String(safeCapacity));
    fd.append("status", status);

    // File field name MUST match FileInterceptor('heroImage') on the NestJS side
    const coverImage = incoming.get("coverImage");
    if (coverImage instanceof File && coverImage.size > 0) {
      fd.append("coverImage", coverImage, coverImage.name);

    }

    const upstream = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Do NOT set Content-Type for multipart; fetch sets the boundary.
      },
      body: fd,
      cache: "no-store",
    });

    // ✅ Transparent pass-through of the real upstream body + status + content-type
    const contentType = upstream.headers.get("content-type") || "application/json";
    const raw = await upstream.text();

    return new NextResponse(raw, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthenticated" ? 401 : 500 },
    );
  }
}
