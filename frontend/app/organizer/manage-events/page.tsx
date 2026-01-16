'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  Ticket,
  DollarSign,
  Clock,
  MapPin,
  TrendingUp,
  CheckCircle,
  Pause,
  ArrowUpDown,
  X,
  BarChart3,
  Share2,
} from 'lucide-react';
import { apiRequestAuth } from '../../../lib/api';
import { resolveEventImageSrc } from '@/lib/images';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001/api';

function getAccessTokenClient(): string | null {
  try {
    return localStorage.getItem('authToken') ?? localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

// -------------------------
// Backend DTO (best-effort)
// -------------------------
type ApiEvent = {
  id: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  eventDate?: string | null; // ISO
  venue?: string | null;
  location?: string | null;

  // optional fields your backend may or may not return
  status?: string | null; // e.g. DRAFT / PUBLISHED / PAUSED / ENDED
  ticketsSold?: number | string | null;
  capacity?: number | string | null;
  totalCapacity?: number | string | null;

  ticketPrice?: number | string | null; // could be pounds or pence depending on your API
  serviceFee?: number | string | null;

  imageUrl?: string | null;
  heroImage?: string | null;

  // not always present
  views?: number | string | null;

  updatedAt?: string | null;
  createdAt?: string | null;
};

function normalizeImageSrc(src?: string) {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;       // blob absolute
  return src.startsWith('/') ? src : `/${src}`;    // local/public
}

function safeNumber(v: any, fallback = 0) {
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : fallback;
}

function formatRelativeTime(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// UI model for this page
type UiEvent = {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  venue: string;
  status: 'on-sale' | 'draft' | 'sold-out' | 'paused' | 'ended';
  ticketsSold: number;
  totalTickets: number;
  revenue: number; // pounds
  views: number;
  image?: string;
  category: string;
  lastUpdated: string;
};

function mapStatus(apiStatus?: string | null, sold: number, cap: number): UiEvent['status'] {
  const s = (apiStatus ?? '').toUpperCase();

  // if sold out, show sold-out no matter what
  if (cap > 0 && sold >= cap) return 'sold-out';

  if (s === 'PUBLISHED' || s === 'ON_SALE') return 'on-sale';
  if (s === 'DRAFT') return 'draft';
  if (s === 'PAUSED') return 'paused';
  if (s === 'ENDED') return 'ended';

  // fallback
  return 'draft';
}

// IMPORTANT: if your API money is in pence, flip this to value/100
function moneyToPounds(value: number) {
  return value; // <-- assumes pounds (your mock data is in pounds)
}

function toUiEvent(e: ApiEvent): UiEvent {
  const dt = new Date(e.eventDate ?? new Date().toISOString());
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');

  const hh = String(dt.getHours()).padStart(2, '0');
  const min = String(dt.getMinutes()).padStart(2, '0');

  const sold = safeNumber(e.ticketsSold, 0);
  const cap = safeNumber((e as any).capacity ?? (e as any).totalCapacity, 0);

  const ticketPrice = safeNumber(e.ticketPrice, 0);
  const revenue = moneyToPounds(ticketPrice * sold);

  const venue = e.location || e.venue || '—';

  return {
    id: e.id,
    name: (e.title ?? 'Untitled event').toString(),
    date: `${yyyy}-${mm}-${dd}`,
    time: `${hh}:${min}`,
    venue,
    status: mapStatus(e.status, sold, cap),
    ticketsSold: sold,
    totalTickets: cap || Math.max(sold, 0),
    revenue,
    views: safeNumber((e as any).views, 0),
    image: e.heroImage ?? e.imageUrl ?? undefined,
    category: (e.category ?? 'Event').toString(),
    lastUpdated: formatRelativeTime(e.updatedAt ?? e.createdAt),
  };
}

export default function ManageEventsPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'revenue' | 'sold'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [events, setEvents] = useState<UiEvent[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // ✅ ensure signed in
  useEffect(() => {
    const token = getAccessTokenClient();
    if (!token) {
      router.push('/organizer/login');
      return;
    }
    setAccessToken(token);
  }, [router]);

  // ✅ load from backend
// ✅ load from backend
useEffect(() => {
  if (!accessToken) return;

  let cancelled = false;

  (async () => {
    try {
      setLoading(true);
      setError(null);

console.log('[manage-events] calling API...', `${API_BASE_URL}/events/my-events`);

      const res = await fetch(`${API_BASE_URL}/events/my-events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (cancelled) return;

      if (res.status === 401) {
        try {
          localStorage.removeItem('accessToken');
        } catch {}
        router.push('/organizer/login');
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || `Failed to load events (${res.status})`);
      }

      const apiEvents = (await res.json()) as ApiEvent[];
      const mapped = (apiEvents ?? []).map(toUiEvent);
      setEvents(mapped);
    } catch (e: any) {
      if (cancelled) return;
      setError(e?.message ?? 'Failed to load events');
    } finally {
      if (!cancelled) setLoading(false);
    }
  })();

  return () => {
    cancelled = true;
  };
}, [accessToken, router]);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-sale':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            On Sale
          </span>
        );
      case 'draft':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs font-semibold">
            <Edit className="w-3 h-3" />
            Draft
          </span>
        );
      case 'sold-out':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
            <Ticket className="w-3 h-3" />
            Sold Out
          </span>
        );
      case 'paused':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold">
            <Pause className="w-3 h-3" />
            Paused
          </span>
        );
      case 'ended':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-500 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Ended
          </span>
        );
      default:
        return null;
    }
  };

  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const base = events.filter((event) => {
      const matchesSearch =
        !q ||
        event.name.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q);

      const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    // simple sort
    const sorted = [...base].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'revenue':
          return b.revenue - a.revenue;
        case 'sold':
          return (b.ticketsSold / Math.max(1, b.totalTickets)) - (a.ticketsSold / Math.max(1, a.totalTickets));
        case 'date':
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

    return sorted;
  }, [events, searchQuery, filterStatus, sortBy]);

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]));
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on events:`, selectedEvents);
    // TODO: implement bulk actions in backend
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">Manage Events</h1>
              <p className="text-gray-400 text-sm">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </p>
            </div>

            <Link href="/organizer/create-event">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-lg">
                <Plus className="w-5 h-5" />
                Create New Event
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Loading / error */}
        {loading && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6 text-gray-400">
            Loading events…
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6 text-red-300">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by name or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors ${
                  showFilters ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <button
                onClick={() => setSortBy(sortBy === 'date' ? 'name' : sortBy === 'name' ? 'revenue' : sortBy === 'revenue' ? 'sold' : 'date')}
                className="px-4 py-3 bg-gray-800 text-gray-400 hover:text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort: {sortBy}
              </button>
            </div>
          </div>

          {/* Filter chips */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {['all', 'on-sale', 'draft', 'sold-out', 'paused', 'ended'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {status === 'all'
                      ? 'All Events'
                      : status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bulk actions */}
          {selectedEvents.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('pause')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => setSelectedEvents([])}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => toggleEventSelection(event.id)}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900 cursor-pointer mt-1"
                  />
                </div>

                {/* Event Image */}
                <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {event.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={normalizeImageSrc(event.image)}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />

                  ) : (
                    <Calendar className="w-12 h-12 text-purple-400" />
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-bold text-lg truncate">{event.name}</h3>
                        {getStatusBadge(event.status)}
                      </div>

                      <div className="flex flex-wrap gap-3 text-gray-400 text-sm mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1 min-w-0">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </span>
                      </div>

                      <p className="text-gray-500 text-xs">Last updated {event.lastUpdated}</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Ticket className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400 text-xs">Sold</span>
                      </div>
                      <p className="text-white font-bold">
                        {event.ticketsSold}/{event.totalTickets}
                      </p>
                      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                          style={{
                            width: `${event.totalTickets > 0 ? (event.ticketsSold / event.totalTickets) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 text-xs">Revenue</span>
                      </div>
                      <p className="text-white font-bold">£{event.revenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400 text-xs">Views</span>
                      </div>
                      <p className="text-white font-bold">{event.views.toLocaleString()}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-400 text-xs">Category</span>
                      </div>
                      <p className="text-white font-bold text-sm">{event.category}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/organizer/manage-events/${event.id}/edit`}>
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit Event
                      </button>
                    </Link>

                    {/* Match your preview route */}
                    <Link href={`/organizer/events/${event.id}/preview`}>
                      <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </Link>

                    <Link href={`/organizer/analytics/${event.id}`}>
                      <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                      </button>
                    </Link>

                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>

                    <button className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!loading && filteredEvents.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">No events found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first event'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Link href="/organizer/create-event">
                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-colors">
                    <Plus className="w-5 h-5" />
                    Create Your First Event
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
