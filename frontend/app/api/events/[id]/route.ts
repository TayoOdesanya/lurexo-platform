import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/apiBase";

export const runtime = "nodejs";

// Prefer NEXT_PUBLIC_API_BASE_URL (matches your .env.local)
const API_BASE_URL = getApiBaseUrl();

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
    case "music": return "MUSIC";
    case "sports": return "SPORTS";
    case "arts": return "ARTS";
    case "comedy": return "COMEDY";
    case "theatre":
    case "theater": return "THEATER";
    case "business": return "CONFERENCE";
    case "food": return "OTHER";
    case "other":
    default: return "OTHER";
  }
}

function toIsoEventDate(eventDate: string, eventTime: string): string {
  const d = new Date(`${eventDate}T${eventTime || "00:00"}:00`);
  return d.toISOString();
}

function parseMoneyToPence(v: unknown): number {
  if (typeof v === "number") return Math.max(0, Math.round(v * 100));
  const s = String(v ?? "").trim();
  if (!s) return 0;
  const cleaned = s.replace(/[£,$\s,]/g, "");
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n * 100));
}

function parseOptionalIso(dt: unknown): string | undefined {
  const s = String(dt ?? "").trim();
  if (!s) return undefined;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

async function readTextOrJson(upstream: Response) {
  const contentType = upstream.headers.get("content-type") || "application/json";
  const raw = await upstream.text();
  let json: any = null;
  try { json = JSON.parse(raw); } catch { /* ignore */ }
  return { contentType, raw, json };
}

// PUT /api/events/:id  (called from your create-event page in edit mode)
export async function PUT(req: Request, ctx: { params: { id: string } }) {
  try {
    const accessToken = getBearerToken(req);
    const eventId = ctx.params.id;
    const incoming = await req.formData();

    // UI fields
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

    const ticketTiersRaw = String(incoming.get("ticketTiers") ?? "[]");
    let ticketTiers: any[] = [];
    try {
      const parsed = JSON.parse(ticketTiersRaw);
      ticketTiers = Array.isArray(parsed) ? parsed : [];
    } catch {
      ticketTiers = [];
    }

    if (!eventId) return NextResponse.json({ error: "id is required" }, { status: 400 });
    if (!eventName.trim()) return NextResponse.json({ error: "eventName is required" }, { status: 400 });
    if (!categoryUi) return NextResponse.json({ error: "category is required" }, { status: 400 });
    if (!shortDescription.trim()) return NextResponse.json({ error: "shortDescription is required" }, { status: 400 });
    if (!eventDate) return NextResponse.json({ error: "eventDate is required" }, { status: 400 });

    const mappedCategory = mapCategory(categoryUi);
    const isoEventDate = toIsoEventDate(eventDate, eventTime);

    const saleStartDate = new Date().toISOString();
    const saleEndDate = isoEventDate;

    const totalCapacity = Number.parseInt(totalCapacityStr || "100", 10);
    const safeCapacity = Number.isFinite(totalCapacity) ? totalCapacity : 100;

    const normalizedTiers = ticketTiers
      .map((t, idx) => {
        const name = String(t?.name ?? "").trim();
        const description = String(t?.description ?? "").trim() || undefined;
        const quantity = Number.parseInt(String(t?.quantity ?? "0"), 10) || 0;
        const maxPerOrder = Number.parseInt(String(t?.maxPerOrder ?? "10"), 10) || 10;
        const price = parseMoneyToPence(t?.price);
        const saleStart = parseOptionalIso(t?.saleStartDate);
        const saleEnd = parseOptionalIso(t?.saleEndDate);

        return {
          idx,
          name,
          description,
          quantity,
          maxPerOrder,
          price,
          saleStartDate: saleStart,
          saleEndDate: saleEnd,
          displayOrder: idx,
        };
      })
      .filter(t => t.name && t.quantity > 0);

    const totalTierQty = normalizedTiers.reduce((sum, t) => sum + t.quantity, 0);
    if (normalizedTiers.length > 0 && totalTierQty > safeCapacity) {
      return NextResponse.json(
        { error: `Total ticket tier quantity (${totalTierQty}) exceeds capacity (${safeCapacity})` },
        { status: 400 }
      );
    }

    // Build DTO-shaped multipart payload for NestJS event update
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

    const coverImage = incoming.get("coverImage");
    if (coverImage instanceof File && coverImage.size > 0) {
      fd.append("coverImage", coverImage, coverImage.name);
    }

    // 1) Update event (backend may be PATCH or PUT; PATCH is often more common)
    const upstream = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: fd,
      cache: "no-store",
    });

    const { contentType, raw, json } = await readTextOrJson(upstream);
    if (!upstream.ok) {
      return new NextResponse(raw, { status: upstream.status, headers: { "content-type": contentType } });
    }

    const updatedEvent = json ?? raw;

    // 2) Best-effort replace tiers:
    //    - try fetch existing tiers from event
    //    - try delete each tier
    //    - recreate tiers
    let createdTiers: any[] = [];

    if (normalizedTiers.length > 0) {
      // Load existing event to get tier IDs (if supported)
      const existingRes = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

      const existing = await existingRes.json().catch(() => null);
      const existingTiers: any[] = Array.isArray(existing?.ticketTiers) ? existing.ticketTiers : [];

      // Attempt delete old tiers (if backend supports it)
      for (const t of existingTiers) {
        const tierId = t?.id;
        if (!tierId) continue;

        // common patterns; try the most likely one
        const del1 = await fetch(`${API_BASE_URL}/events/${eventId}/ticket-tiers/${tierId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });

        if (!del1.ok) {
          // If delete isn't supported, editing tiers would duplicate — fail loudly so it's obvious.
          const errTxt = await del1.text().catch(() => "");
          return NextResponse.json(
            { error: `Cannot replace ticket tiers (delete unsupported). Delete failed: ${errTxt || del1.statusText}` },
            { status: 400 }
          );
        }
      }

      // Recreate tiers
      for (const tier of normalizedTiers) {
        const tierRes = await fetch(`${API_BASE_URL}/events/${eventId}/ticket-tiers`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: tier.name,
            description: tier.description,
            price: tier.price, // pence
            quantity: tier.quantity,
            maxPerOrder: tier.maxPerOrder,
            saleStartDate: tier.saleStartDate,
            saleEndDate: tier.saleEndDate,
            displayOrder: tier.displayOrder,
          }),
          cache: "no-store",
        });

        if (!tierRes.ok) {
          const tierErrText = await tierRes.text().catch(() => "");
          return NextResponse.json(
            { error: `Failed updating ticket tier "${tier.name}": ${tierErrText || tierRes.statusText}` },
            { status: 400 }
          );
        }

        const createdTier = await tierRes.json().catch(() => ({}));
        createdTiers.push(createdTier);
      }
    }

    // Return updated event + tiers (if any)
    if (typeof updatedEvent === "string") {
      return new NextResponse(updatedEvent, { status: 200, headers: { "content-type": contentType } });
    }

    return NextResponse.json({ ...updatedEvent, ticketTiers: createdTiers }, { status: 200 });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthenticated" ? 401 : 500 });
  }
}

// Optional: allow DELETE /api/events/:id from frontend if you ever need it
export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  try {
    const accessToken = getBearerToken(req);
    const eventId = ctx.params.id;

    const upstream = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    const raw = await upstream.text();

    if (!upstream.ok) {
      return new NextResponse(raw, { status: upstream.status, headers: { "content-type": contentType } });
    }

    return new NextResponse(raw || "", { status: 200, headers: { "content-type": contentType } });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthenticated" ? 401 : 500 });
  }
}
