import { NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import crypto from "crypto";

/**
 * TODO: Replace this with however your auth stores the logged-in user.
 * Examples:
 * - NextAuth: getServerSession(authOptions) -> session.user.id
 * - Custom: read cookie/JWT and extract userId claim
 */
async function getCurrentUserIdOrThrow(): Promise<string> {
  // --- PLACEHOLDER ---
  // Throw if not logged in:
  // throw new Error("Unauthenticated");

  // Return a GUID string.
  // Replace with real implementation from your last chat.
  const userId = "00000000-0000-0000-0000-000000000000";
  if (!userId) throw new Error("Unauthenticated");
  return userId;
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserIdOrThrow();

    const form = await req.formData();

    // Basic fields
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

    // File
    const coverImage = form.get("coverImage");
    let coverImageUrl = "";

    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      const bytes = await coverImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure folder: /public/events/<userId>/
      const dir = path.join(process.cwd(), "public", "events", userId);
      await mkdir(dir, { recursive: true });

      // Safer filename
      const ext = path.extname(coverImage.name) || ".jpg";
      const filename = `${crypto.randomUUID()}${ext}`;
      const filepath = path.join(dir, filename);

      await writeFile(filepath, buffer);

      // This is what you store and render in the UI
      coverImageUrl = `/events/${userId}/${filename}`;
    }

    // Build event model
    const event = {
      organiserId: userId, // ✅ requirement (1)
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
      coverImageUrl, // ✅ points to /public/events/<userId>/...
      createdAtUtc: new Date().toISOString(),
    };

    // TODO: persist event to DB (Prisma/SQL/etc)
    // const created = await db.event.create({ data: event });

    return NextResponse.json(
      { ok: true, event /*, created*/ },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: e?.message === "Unauthenticated" ? 401 : 500 }
    );
  }
}
