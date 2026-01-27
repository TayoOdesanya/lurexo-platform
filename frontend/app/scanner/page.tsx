'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiBase';
import { resolveEventImageSrc } from '@/lib/images';

const API_BASE_URL = getApiBaseUrl();

function getAccessTokenClient(): string | null {
  try {
    return localStorage.getItem('authToken') ?? localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

type ApiEvent = {
  id: string;
  title?: string | null;
  eventDate?: string | null;
  venue?: string | null;
  location?: string | null;
  status?: string | null;
  heroImage?: string | null;
  imageUrl?: string | null;
  checkedInCount?: number | string | null;
  ticketsSold?: number | string | null;
  capacity?: number | string | null;
  totalCapacity?: number | string | null;
};

type UiEvent = {
  id: string;
  name: string;
  date: string;
  venue: string;
  status: string;
  image?: string;
  totalTickets: number;
  soldTickets: number;
  checkedInCount: number;
};

function safeNumber(v: any, fallback = 0) {
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : fallback;
}

function toUiEvent(e: ApiEvent): UiEvent {
  const dt = new Date(e.eventDate ?? new Date().toISOString());
  const sold = safeNumber(e.ticketsSold, 0);
  const cap = safeNumber((e as any).capacity ?? (e as any).totalCapacity, 0);
  return {
    id: e.id,
    name: (e.title ?? 'Untitled event').toString(),
    date: dt.toISOString(),
    venue: e.location || e.venue || '-',
    status: (e.status ?? 'UNKNOWN').toString(),
    image: e.heroImage ?? e.imageUrl ?? undefined,
    totalTickets: cap || Math.max(sold, 0),
    soldTickets: sold,
    checkedInCount: safeNumber(e.checkedInCount, 0),
  };
}

function formatStatus(status?: string | null) {
  const s = (status ?? '').toUpperCase();
  if (s === 'PUBLISHED' || s === 'ON_SALE') return { label: 'On Sale', cls: 'bg-green-500/20 text-green-400' };
  if (s === 'DRAFT') return { label: 'Draft', cls: 'bg-gray-500/20 text-gray-300' };
  if (s === 'PAUSED') return { label: 'Paused', cls: 'bg-amber-500/20 text-amber-400' };
  if (s === 'ENDED') return { label: 'Ended', cls: 'bg-red-500/20 text-red-400' };
  return { label: 'Event', cls: 'bg-blue-500/20 text-blue-400' };
}

export default function ScannerSelectionPage() {
  const router = useRouter();
  const [events, setEvents] = useState<UiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = getAccessTokenClient();
        if (!token) {
          setEvents([]);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/events/my-events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = (await response.json()) as ApiEvent[];
          const mapped = (data ?? []).map(toUiEvent);
          // Filter to only show events happening today or in the future
          const upcomingEvents = mapped.filter((event) => {
            const eventDate = new Date(event.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return eventDate >= today;
          });
          setEvents(upcomingEvents);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <QrCode className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold">QR Scanner</h1>
          </div>
          <p className="text-gray-400">Select an event to start scanning tickets</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <QrCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-gray-400 mb-6">
              You don't have any upcoming events to scan tickets for.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => router.push(`/scanner/${event.id}`)}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all hover:scale-[1.02] text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                    {event.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveEventImageSrc(event.image) ?? ''}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <QrCode className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors truncate">
                        {event.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${formatStatus(event.status).cls}`}>
                        {formatStatus(event.status).label}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.totalTickets} tickets • {event.soldTickets || 0} sold
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-auto flex flex-col items-end justify-between h-full">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">
                        {event.checkedInCount || 0}
                      </div>
                      <div className="text-xs text-gray-400">Checked In</div>
                    </div>

                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-400" />
            How It Works
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">1.</span>
              <span>Select the event you're scanning for</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">2.</span>
              <span>Scanner will download ticket data for offline use</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">3.</span>
              <span>Scan QR codes or use manual entry</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">4.</span>
              <span>Works offline - syncs automatically when connection returns</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}


