'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle, MapPin, Star, Users } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiBase';

const API_BASE_URL = getApiBaseUrl();

type Organizer = {
  id?: string | null;
  name?: string | null;
  username?: string | null;
  avatar?: string | null;
  verified?: boolean | null;
};

type TicketTier = {
  price?: number | string | null;
};

type EventApi = {
  id: string;
  title: string;
  category?: string | null;
  eventDate: string;
  location?: string | null;
  venue?: string | null;
  city?: string | null;
  ticketPrice?: number | string | null;
  ticketTiers?: TicketTier[] | null;
  organizer?: Organizer | null;
};

type OrganizerProfileResponse = {
  organizer: {
    id: string;
    name: string;
    username: string;
    avatar?: string | null;
    verified: boolean;
  };
  stats: {
    eventsHosted: number;
    ticketsSold: number;
    totalCapacity: number;
  };
  events: EventApi[];
};

type OrganizerProfileView = {
  displayName: string;
  tagline: string;
  location: string;
  bio: string;
  verified: boolean;
  stats: OrganizerProfileResponse['stats'];
  events: EventApi[];
};

const toNumber = (value: unknown) => {
  const n = typeof value === 'string' ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : NaN;
};

const getDisplayPrice = (event: EventApi): number | null => {
  const tiers = Array.isArray(event.ticketTiers) ? event.ticketTiers : [];
  const tierPrices = tiers.map((tier) => toNumber(tier?.price)).filter((n) => Number.isFinite(n));
  if (tierPrices.length > 0) {
    return Math.min(...tierPrices) / 100;
  }

  const directPrice = toNumber(event.ticketPrice);
  if (Number.isFinite(directPrice)) return directPrice;

  return null;
};

export default function OrganizerPublicProfilePage() {
  const params = useParams<{ id: string }>();
  const organizerId = params?.id ?? 'organizer';

  const [profile, setProfile] = useState<OrganizerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/organizers/${organizerId}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load organizer');
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setProfile(data ?? null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [organizerId]);

  const organizerProfile = useMemo<OrganizerProfileView | null>(() => {
    if (!profile) return null;
    const firstEvent = profile.events?.[0];
    const location =
      firstEvent?.location ||
      [firstEvent?.venue, firstEvent?.city].filter(Boolean).join(' - ') ||
      'United Kingdom';
    return {
      displayName: profile.organizer.name || 'Organizer',
      tagline: 'Independent organizer on Lurexo.',
      location,
      bio:
        'This organizer focuses on fair ticketing, transparent pricing, and great fan experiences. Follow for upcoming events and announcements.',
      verified: profile.organizer.verified,
      stats: profile.stats,
      events: profile.events ?? [],
    };
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading organizer...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">{error}</div>
      </div>
    );
  }

  if (!organizerProfile || organizerProfile.events.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <Link href="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to events
          </Link>
          <div className="mt-6 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 text-center text-gray-400">
            No public events found for this organizer yet.
          </div>
        </div>
      </div>
    );
  }

  const formatStat = (value?: number, fallback = 'N/A') =>
    value === undefined || Number.isNaN(value) ? fallback : value.toLocaleString();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Link href="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to events
        </Link>

        <div className="mt-6 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xl font-bold">
                {organizerProfile.displayName[0]?.toUpperCase() ?? 'O'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">{organizerProfile.displayName}</h1>
                  {organizerProfile.verified && <CheckCircle className="w-5 h-5 text-blue-400" />}
                </div>
                <p className="text-gray-300 mt-1">{organizerProfile.tagline}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{organizerProfile.location}</span>
                </div>
              </div>
            </div>

            <button className="px-5 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition">
              Follow
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                Followers
              </div>
              <p className="text-xl font-semibold mt-2">N/A</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                Events hosted
              </div>
              <p className="text-xl font-semibold mt-2">{formatStat(organizerProfile.stats.eventsHosted)}</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Star className="w-4 h-4" />
                Rating
              </div>
              <p className="text-xl font-semibold mt-2">N/A</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-300 leading-relaxed">{organizerProfile.bio}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upcoming events</h2>
            <span className="text-sm text-gray-400">Showing {organizerProfile.events.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizerProfile.events.map((event) => {
              const price = getDisplayPrice(event);
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block bg-gray-900/80 border border-gray-800 rounded-xl p-4 hover:border-purple-500/60 transition"
                >
                  <div className="text-xs text-purple-300 font-semibold uppercase">{event.category ?? 'Event'}</div>
                  <h3 className="text-lg font-semibold mt-2">{event.title}</h3>
                  <div className="text-sm text-gray-400 mt-2">
                    {new Date(event.eventDate).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {event.location || [event.venue, event.city].filter(Boolean).join(' - ') || 'Location TBC'}
                  </div>
                  <div className="mt-3 text-white font-semibold">
                    {price === null ? 'Price TBC' : `From GBP ${price.toFixed(2)}`}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
