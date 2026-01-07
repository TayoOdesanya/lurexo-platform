import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { BlobServiceClient } from "@azure/storage-blob";

export const runtime = "nodejs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Azure (works with Azurite locally too)
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const AZURE_STORAGE_CONTAINER = process.env.AZURE_STORAGE_CONTAINER || "events";
// IMPORTANT: this base should NOT include the container
// Example (Azurite): http://127.0.0.1:10000/devstoreaccount1
const AZURE_STORAGE_PUBLIC_BASE_URL = process.env.AZURE_STORAGE_PUBLIC_BASE_URL!;

function getBearerToken(req: Request): string {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth) throw new Error("Unauthenticated");
  const [scheme, token] = auth.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) throw new Error("Unauthenticated");
  return token;
}

async function getCurrentUserIdFromNest(accessToken: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Unauthenticated");
  const me = (await res.json()) as { id: string };
  if (!me?.id) throw new Error("Unauthenticated");
  return me.id;
}

function mapCategoryToEnum(raw: string): string {
  const v = (raw || "").toLowerCase();
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
    case "conference":
      return "CONFERENCE";
    default:
      return "OTHER";
  }
}

function combineToIso(eventDate: string, eventTime: string): string {
  // eventDate: YYYY-MM-DD, eventTime: HH:mm
  // Create a local datetime and convert to ISO
  const safeTime = eventTime?.trim() ? eventTime : "19:00";
  const dt = new Date(`${eventDate}T${safeTime}:00`);
  if (Number.isNaN(dt.getTime())) return new Date().toISOString();
  return dt.toISOString();
}

async function uploadCoverToAzure(organiserId: string, file: File) {
  if (!AZURE_STORAGE_CONNECTION_STRING || !AZURE_STORAGE_PUBLIC_BASE_URL) {
    throw new Error("Azure storage env vars missing");
  }

  const service = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = service.getContainerClient(AZURE_STORAGE_CONTAINER);
  await containerClient.createIfNotExists({ access: "blob" as any });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name || "") || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  const blobName = `${organiserId}/${filename}`;

  const blobClient = containerClient.getBlockBlobClient(blobName);

  await blobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type || "image/jpeg" },
  });

  // Public URL (Azurite or Azure)
  const trimmedBase = AZURE_STORAGE_PUBLIC_BASE_URL.replace(/\/$/, "");
  const url = `${trimmedBase}/${AZURE_STORAGE_CONTAINER}/${blobName}`;

  return { url, blobName };
}

export async function POST(req: Request) {
  try {
    const accessToken = getBearerToken(req);
    const organiserId = await getCurrentUserIdFromNest(accessToken);

    const form = await req.formData();

    // Frontend fields
    const eventName = String(form.get("eventName") ?? "");
    const categoryRaw = String(form.get("category") ?? "");
    const shortDescription = String(form.get("shortDescription") ?? "");
    const longDescription = String(form.get("longDescription") ?? "");
    const eventDate = String(form.get("eventDate") ?? "");
    const eventTime = String(form.get("eventTime") ?? "");
    const venue = String(form.get("venue") ?? "");
    const address = String(form.get("address") ?? "");
    const city = String(form.get("city") ?? "");
    const postcode = String(form.get("postcode") ?? "");

    // Upload image (optional)
    let heroImage = "";
    const coverImage = form.get("coverImage");
    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      const uploaded = await uploadCoverToAzure(organiserId, coverImage);
      heroImage = uploaded.url;
    }

    // Backend-required DTO fields (based on your validation errors)
    const title = eventName;
    const description = (longDescription?.trim() || shortDescription?.trim() || "").trim();
    const category = mapCategoryToEnum(categoryRaw);
    const postalCode = postcode;

    const startIso = combineToIso(eventDate, eventTime);
    const saleStartDate = new Date().toISOString();
    const saleEndDate = startIso;

    // Basic capacity: sum of ticketTiers quantities if they exist, else default
    // (Your UI currently has placeholder tickets, so default to 100)
    const totalCapacity = 100;

    // IMPORTANT: Only send what the backend DTO expects (avoid forbidNonWhitelisted)
    const payload: any = {
      title,
      description,
      category,
      heroImage,
      postalCode,
      saleStartDate,
      saleEndDate,
      totalCapacity,

      // These might exist in your DTO; keep only if your DTO supports them.
      // If you still get "property X should not exist", remove them.
      venue,
      address,
      city,
      eventDate: startIso,
    };

    const created = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!created.ok) {
      const err = await created.json().catch(async () => ({ message: await created.text() }));
      return NextResponse.json(
        { ok: false, upstream: err },
        { status: created.status }
      );
    }

    const createdEvent = await created.json();
    return NextResponse.json({ ok: true, event: createdEvent }, { status: 201 });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";
    return NextResponse.json(
      { ok: false, error: msg },
      { status: msg === "Unauthenticated" ? 401 : 500 }
    );
  }
}
