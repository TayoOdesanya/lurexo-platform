import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
import { getApiBaseUrl } from "@/lib/apiBase";

const API_BASE_URL = getApiBaseUrl();

function getBearerToken(req: Request): string {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!auth) throw new Error('Unauthenticated');
  const [scheme, token] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) throw new Error('Unauthenticated');
  return token;
}

function mapCategoryToEnum(raw: string): string {
  const v = (raw || '').toLowerCase();
  switch (v) {
    case 'music':
      return 'MUSIC';
    case 'comedy':
      return 'COMEDY';
    case 'sports':
      return 'SPORTS';
    case 'theatre':
      return 'THEATRE';
    case 'food':
    case 'food & drink':
    case 'food_and_drink':
      return 'FOOD_AND_DRINK';
    case 'art':
      return 'ART';
    default:
      return 'OTHER';
  }
}

function combineToIso(date: string, time: string): string {
  // date: YYYY-MM-DD, time: HH:mm
  if (!date) return new Date().toISOString();
  const t = time || '19:00';
  const d = new Date(`${date}T${t}:00`);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export async function POST(req: Request) {
  try {
    const accessToken = getBearerToken(req);
    const form = await req.formData();

    // Frontend fields
    const eventName = String(form.get('eventName') ?? '');
    const categoryRaw = String(form.get('category') ?? '');
    const shortDescription = String(form.get('shortDescription') ?? '');
    const longDescription = String(form.get('longDescription') ?? '');
    const eventDate = String(form.get('eventDate') ?? '');
    const eventTime = String(form.get('eventTime') ?? '');
    const venue = String(form.get('venue') ?? '');
    const address = String(form.get('address') ?? '');
    const city = String(form.get('city') ?? '');
    const postcode = String(form.get('postcode') ?? '');

    const title = eventName;
    const description = (longDescription?.trim() || shortDescription?.trim() || '').trim();
    const category = mapCategoryToEnum(categoryRaw);
    const postalCode = postcode;

    const startIso = combineToIso(eventDate, eventTime);
    const saleStartDate = new Date().toISOString();
    const saleEndDate = startIso;
    const totalCapacity = 100;

    // Forward as multipart to backend, so backend owns storage + provider URLs.
    const upstream = new FormData();
    upstream.set('title', title);
    upstream.set('description', description);
    upstream.set('category', category);
    upstream.set('postalCode', postalCode);
    upstream.set('saleStartDate', saleStartDate);
    upstream.set('saleEndDate', saleEndDate);
    upstream.set('totalCapacity', String(totalCapacity));
    upstream.set('venue', venue);
    upstream.set('address', address);
    upstream.set('city', city);
    upstream.set('eventDate', startIso);

    const coverImage = form.get('coverImage');
    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      upstream.set('coverImage', coverImage);
    }

    const created = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: upstream,
    });

    if (!created.ok) {
      const err = await created.json().catch(async () => ({ message: await created.text() }));
      return NextResponse.json({ ok: false, upstream: err }, { status: created.status });
    }

    const json = await created.json();
    return NextResponse.json({ ok: true, event: json });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
