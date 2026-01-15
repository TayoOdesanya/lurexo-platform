import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";
import { mkdir, writeFile } from "fs/promises";

export const runtime = "nodejs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

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
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Unauthenticated");

  const me = (await res.json()) as { id: string };
  if (!me?.id) throw new Error("Unauthenticated");
  return me.id;
}

export async function POST(req: Request) {
  try {
    // ✅ infer organiserId from logged-in user
    const accessToken = getBearerToken(req);
    const organiserId = await getCurrentUserIdFromNest(accessToken);

    const form = await req.formData();

    const eventName = String(form.get("eventName") ?? "");
    const category = String(form.get("category") ?? "");
    const shortDescription = String(form.get("shortDescription") ?? "");
    const longDescription = String(form.get("longDescription") ?? "");
    const eventDate = String(form.get("eventDate") ?? "");
    const eventTime = String(form.get("eventTime") ?? "");
    const venue = String(form.get("venue") ?? "");
    const address = String(form.get("address") ?? "");
    const city = String(form.get("city") ?? "");
    const postcode = String(form.get("postcode") ?? "");
    const status = String(form.get("status") ?? "DRAFT");

    // ✅ save cover image to /public/events/<organiserId>/
    const coverImage = form.get("coverImage");
    let coverImageUrl = "";

    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      const bytes = await coverImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const dir = path.join(process.cwd(), "public", "events", organiserId);
      await mkdir(dir, { recursive: true });

      const ext = path.extname(coverImage.name) || ".jpg";
      const filename = `${crypto.randomUUID()}${ext}`;
      const filepath = path.join(dir, filename);

      await writeFile(filepath, buffer);

      coverImageUrl = `/events/${organiserId}/${filename}`;
    }

    const event = {
      organiserId,
      eventName,
      category,
      shortDescription,
      longDescription,
      eventDate,
      eventTime,
      venue,
      address,
      city,
      postcode,
      status,
      coverImageUrl,
      createdAtUtc: new Date().toISOString(),
    };

    // TODO: persist to your NestJS API or DB
    // Example: forward to NestJS events endpoint:
    // const created = await fetch(`${API_BASE_URL}/events`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    //   body: JSON.stringify(event),
    // });
    // if (!created.ok) throw new Error(await created.text());
    // const createdEvent = await created.json();

    return NextResponse.json({ ok: true, event }, { status: 201 });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";
    return NextResponse.json(
      { ok: false, error: msg },
      { status: msg === "Unauthenticated" ? 401 : 500 }
    );
  }
}
