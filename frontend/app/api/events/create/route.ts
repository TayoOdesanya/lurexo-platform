import { NextResponse } from "next/server";
import { getServerApiBaseUrl } from "@/lib/serverApiBase";

export const runtime = "nodejs";
const API_BASE_URL = getServerApiBaseUrl();

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
  // remove currency symbols/commas
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

export async function POST(req: Request) {
  try {
    const accessToken = getBearerToken(req);
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

    // Ticket tiers (JSON string from UI)
    const ticketTiersRaw = String(incoming.get("ticketTiers") ?? "[]");
    let ticketTiers: any[] = [];
    try {
      const parsed = JSON.parse(ticketTiersRaw);
      ticketTiers = Array.isArray(parsed) ? parsed : [];
    } catch {
      ticketTiers = [];
    }

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

    // Validate tiers against capacity (if tiers provided)
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

    const coverImage = incoming.get("coverImage");
    if (coverImage instanceof File && coverImage.size > 0) {
      fd.append("coverImage", coverImage, coverImage.name);
    }

    // 1) Create the event
    const upstream = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: fd,
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    const raw = await upstream.text();

    if (!upstream.ok) {
      return new NextResponse(raw, { status: upstream.status, headers: { "content-type": contentType } });
    }

    // 2) Create tiers
    let createdEvent: any;
    try {
      createdEvent = JSON.parse(raw);
    } catch {
      // Event created but response wasn’t JSON (unexpected)
      return new NextResponse(raw, { status: 200, headers: { "content-type": contentType } });
    }

    const eventId = createdEvent?.id;
    if (!eventId) {
      return NextResponse.json({ error: "Event created but no id returned" }, { status: 500 });
    }

    const createdTiers: any[] = [];
    if (normalizedTiers.length > 0) {
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
          // best-effort rollback so you don't end up with an event but no tiers
          await fetch(`${API_BASE_URL}/events/${eventId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
          }).catch(() => null);

          const tierErrText = await tierRes.text().catch(() => "");
          return NextResponse.json(
            { error: `Failed creating ticket tier "${tier.name}": ${tierErrText || tierRes.statusText}` },
            { status: 400 }
          );
        }

        const createdTier = await tierRes.json().catch(() => ({}));
        createdTiers.push(createdTier);
      }
    }

    return NextResponse.json({ ...createdEvent, ticketTiers: createdTiers }, { status: 200 });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthenticated" ? 401 : 500 });
  }
}
