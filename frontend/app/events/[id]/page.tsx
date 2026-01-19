'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { resolveEventImageSrc } from '@/lib/images';

type Organizer = {
  name: string;
  username: string;
  avatar?: string | null;
  verified?: boolean;
};

type TicketTier = {
  id: string;
  name: string;
  price: number;
  serviceFee?: number;
  available?: number;
  features?: string[];
};

type EventDto = {
  id: string;
  title: string;
  category?: string | null;
  location: string;
  description?: string | null;
  longDescription?: string | null;

  eventDate: string;
  eventEndDate?: string | null;
  doorsOpen?: string | null;

  capacity?: number | null;
  ticketsSold?: number | null;

  ticketPrice?: number | string | null;
  serviceFee?: number | string | null;

  heroImage?: string | null;
  imageUrl?: string | null;

  galleryImages?: string[] | null;

  organizer?: Organizer | null;

  ticketTiers?: TicketTier[] | null;

  venue?: {
    name?: string | null;
    address?: string | null;
  } | null;
};

function normalizeImageSrc(src: unknown): string | null {
  if (!src || typeof src !== 'string') return null;
  return resolveEventImageSrc(src) ?? null;
}

function formatDate(dateString?: string | null) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(dateString?: string | null) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Hydration guard
  useEffect(() => setMounted(true), []);

useEffect(() => {
  if (!id) return;

  setLoading(true);
  setError(null);

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

  fetch(`${base}/events/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch event');
      return res.json();
    })
    .then((data: EventDto) => {
      setEvent(data);
      setLoading(false);
    })
    .catch((err: unknown) => {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    });
}, [id]);


  /**
   * IMPORTANT: all hooks must run on every render.
   * The previous version returned early when !mounted, which caused useMemo to be skipped,
   * changing hook order between renders. So we compute memos BEFORE any conditional return.
   */

  const heroSrc = useMemo(() => {
    const src =
      event?.heroImage ||
      event?.imageUrl ||
      (event?.galleryImages?.length ? event.galleryImages[0] : null);

    return normalizeImageSrc(src);
  }, [event?.heroImage, event?.imageUrl, event?.galleryImages]);

  const gallery = useMemo(() => {
    const imgs = event?.galleryImages ?? [];
    return imgs
      .map((x) => normalizeImageSrc(x))
      .filter((x): x is string => Boolean(x));
  }, [event?.galleryImages]);

  // Pricing + meta (safe even when event is null)
  const baseTicketPrice = Number(event?.ticketPrice ?? 0);
  const baseServiceFee = Number(event?.serviceFee ?? 0);
  const fromPrice = baseTicketPrice + baseServiceFee;

  const capacity = Number(event?.capacity ?? 0);
  const ticketsSold = Number(event?.ticketsSold ?? 0);
  const percentSold = capacity > 0 ? (ticketsSold / capacity) * 100 : 0;
  const isSellingFast = capacity > 0 && percentSold > 80;

  // Theme classes
  const bgPrimary = isDarkMode ? 'bg-black' : 'bg-gray-50';
  const bgSecondary = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const bgGradient = isDarkMode
    ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-black'
    : 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const textTertiary = isDarkMode ? 'text-gray-500' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-gray-800' : 'border-gray-200';

  // Only after all hooks:
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgPrimary}`}>
      {/* Top Nav */}
      <header className={`relative overflow-hidden ${bgGradient}`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              ← Back
            </button>

            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">Lurexo</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <Link href="/events" className="text-gray-200 hover:text-white transition-colors hidden sm:inline">
              All events
            </Link>
          </div>
        </nav>

        {/* Header content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10">
          {loading ? (
            <div className="py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
            </div>
          ) : error ? (
            <div className="py-10">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
                <p className="text-red-300 font-semibold mb-2">Connection Error</p>
                <p className="text-gray-200">
                  Couldn’t load this event. Make sure the backend is running on{' '}
                  <span className="font-mono">http://localhost:3001/api</span>.
                </p>
              </div>
            </div>
          ) : !event ? (
            <div className="py-10">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-8">
                <p className="text-white font-semibold mb-2">Event not found</p>
                <p className="text-gray-200">This event may not exist or was removed.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    {event.category && (
                      <span className="px-3 py-1 bg-black/50 border border-white/10 text-white text-xs font-semibold rounded-full">
                        {String(event.category).toUpperCase()}
                      </span>
                    )}
                    {isSellingFast && (
                      <span className="px-3 py-1 bg-red-500/90 text-white text-xs font-semibold rounded-full animate-pulse">
                        🔥 Selling Fast
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">{event.title}</h1>

                  {/* Organizer */}
                  {event.organizer?.username && (
                    <Link href={`/organizers/${event.organizer.username}`} className="inline-flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                        {event.organizer.avatar ? (
                          <img
                            src={event.organizer.avatar}
                            alt={event.organizer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{event.organizer.name?.charAt(0) ?? 'O'}</span>
                          </div>
                        )}
                      </div>

                      <span className="text-gray-200 text-sm group-hover:text-white transition-colors">
                        by <span className="font-semibold">{event.organizer.name}</span>
                      </span>

                      {event.organizer.verified && (
                        <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </Link>
                  )}

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                    <div className="px-5 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                      <p className="text-gray-200 text-xs mb-1">Date</p>
                      <p className="text-white font-bold">{formatDate(event.eventDate)}</p>
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                      <p className="text-gray-200 text-xs mb-1">Time</p>
                      <p className="text-white font-bold">{formatTime(event.eventDate)}</p>
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                      <p className="text-gray-200 text-xs mb-1">Location</p>
                      <p className="text-white font-bold truncate">{event.location}</p>
                    </div>
                  </div>
                </div>

                {/* Price / CTA */}
                <div className="w-full lg:w-[360px]">
                  <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-6">
                    <p className="text-gray-200 text-sm mb-1">From</p>
                    <p className="text-white text-4xl font-bold mb-1">
                      £{Number.isFinite(fromPrice) ? fromPrice.toFixed(2) : '0.00'}
                    </p>
                    <p className="text-gray-200 text-xs mb-6">inc. fees</p>

                    <button
                      onClick={() => router.push(`/checkout?event=${encodeURIComponent(event.id)}`)}
                      className="w-full bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-[1.01]"
                    >
                      Get tickets
                    </button>

                    {capacity > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-gray-200 mb-2">
                          <span>Sold</span>
                          <span>{Math.round(percentSold)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-black/30 overflow-hidden">
                          <div className="h-full bg-white/70" style={{ width: `${Math.min(100, Math.max(0, percentSold))}%` }} />
                        </div>
                        <p className="text-gray-200 text-xs mt-2">
                          {ticketsSold.toLocaleString()} / {capacity.toLocaleString()} tickets
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hero image strip */}
              <div className="mt-10 rounded-3xl overflow-hidden border border-white/10 bg-black/20">
                {heroSrc ? (
                  <img src={heroSrc} alt={event.title} className="w-full h-[280px] md:h-[360px] object-cover" />
                ) : (
                  <div className="w-full h-[280px] md:h-[360px] flex items-center justify-center text-gray-200">
                    No image available
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                isDarkMode ? 'border-purple-500' : 'border-purple-600'
              }`}
            />
          </div>
        ) : error ? null : !event ? null : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left */}
            <div className="lg:col-span-2 space-y-8">
              <section className={`${bgSecondary} border ${borderColor} rounded-2xl p-8`}>
                <h2 className={`text-2xl font-bold ${textPrimary} mb-4`}>About this event</h2>
                <p className={`${textSecondary} leading-relaxed`}>
                  {event.description || event.longDescription || 'No description provided.'}
                </p>

                {event.longDescription && event.description && (
                  <p className={`${textSecondary} leading-relaxed mt-4`}>{event.longDescription}</p>
                )}
              </section>

              {(event.venue?.name || event.venue?.address) && (
                <section className={`${bgSecondary} border ${borderColor} rounded-2xl p-8`}>
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-4`}>Venue</h2>
                  {event.venue?.name && <p className={`${textPrimary} font-semibold`}>{event.venue.name}</p>}
                  {event.venue?.address && <p className={`${textSecondary} mt-1`}>{event.venue.address}</p>}
                </section>
              )}

              {gallery.length > 0 && (
                <section className={`${bgSecondary} border ${borderColor} rounded-2xl p-8`}>
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-4`}>Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.map((src, idx) => (
                      <img
                        key={`${src}-${idx}`}
                        src={src}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full aspect-video object-cover rounded-xl border border-transparent hover:border-purple-500/50 transition"
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right */}
            <aside className="space-y-6">
              <div className={`${bgSecondary} border ${borderColor} rounded-2xl p-8 sticky top-6`}>
                <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>Event details</h3>

                <div className="space-y-4">
                  <div>
                    <p className={`${textTertiary} text-xs mb-1`}>Date</p>
                    <p className={`${textPrimary} font-semibold`}>{formatDate(event.eventDate)}</p>
                  </div>

                  <div>
                    <p className={`${textTertiary} text-xs mb-1`}>Start</p>
                    <p className={`${textPrimary} font-semibold`}>{formatTime(event.eventDate)}</p>
                  </div>

                  {event.doorsOpen && (
                    <div>
                      <p className={`${textTertiary} text-xs mb-1`}>Doors open</p>
                      <p className={`${textPrimary} font-semibold`}>{formatTime(event.doorsOpen)}</p>
                    </div>
                  )}

                  {event.eventEndDate && (
                    <div>
                      <p className={`${textTertiary} text-xs mb-1`}>Ends</p>
                      <p className={`${textPrimary} font-semibold`}>{formatTime(event.eventEndDate)}</p>
                    </div>
                  )}

                  <div>
                    <p className={`${textTertiary} text-xs mb-1`}>Location</p>
                    <p className={`${textPrimary} font-semibold`}>{event.location}</p>
                  </div>
                </div>

                <div className={`mt-6 pt-6 border-t ${borderColor}`}>
                  <button
                    onClick={() => router.push(`/checkout?event=${encodeURIComponent(event.id)}`)}
                    className={`w-full px-6 py-3 rounded-full font-semibold transition-all hover:scale-[1.01] ${
                      isDarkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Get tickets
                  </button>

                  <p className={`${textTertiary} text-xs text-center mt-3`}>Transparent pricing • No surprises</p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
