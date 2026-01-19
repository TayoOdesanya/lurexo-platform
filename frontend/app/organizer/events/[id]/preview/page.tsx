'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { resolveEventImageSrc } from '@/lib/images';
import {
  ArrowLeft,
  Edit,
  Eye,
  Calendar,
  MapPin,
  Clock,
  Users,
  Check,
  Info,
  Shield,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  AlertCircle,
  Zap,
} from 'lucide-react';

// ------- UI model that matches what your preview page expects
type UiTicketTier = {
  id: string;
  name: string;
  price: number;      // pounds
  serviceFee: number; // pounds
  quantity: number;
  available: number;
  description?: string;
  features?: string[];
};

type UiEvent = {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  highlights: string[];

  eventDate: string;
  eventEndDate?: string;
  doorsOpen?: string;

  venue: { name: string; address: string; capacity?: number };

  heroImage?: string;
  gallery: string[];

  ticketTiers: UiTicketTier[];

  organizer: { name: string; verified: boolean };

  ageRestriction: string;
  refundPolicy: string;

  allowResale: boolean;
  resaleCap: number;
  allowTransfers: boolean;
  visibility: 'draft' | 'published' | 'hidden';

  trainStations: string[];
  parkingInfo: string;
  accessibilityNotes: string;

  faqs: { question: string; answer: string }[];
};

type ApiEvent = {
  id: string;
  title?: string | null;
  category?: string | null;
  location?: string | null;

  description?: string | null;
  eventDate?: string | null;
  doorsOpen?: string | null;

  heroImage?: string | null;
  imageUrl?: string | null;
  galleryImages?: string[] | null;

  ticketPrice?: number | string | null;
  serviceFee?: number | string | null;

  ticketsSold?: number | null;
  capacity?: number | null;

  venue?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;

  status?: string | null;

  allowResale?: boolean | null;
  resaleCapValue?: number | null;

  organizer?: { name?: string | null; verified?: boolean | null } | null;

  ticketTiers?: Array<{
    id: string;
    name?: string | null;
    price?: number | null;
    quantity?: number | null;
    quantitySold?: number | null;
    description?: string | null;
  }> | null;
};


// If your DB stores money in pence, keep this conversion.
// If your API already returns pounds, change to: return value;
function moneyToPounds(value: number) {
  return value / 100;
}

function safeNumber(v: any, fallback = 0) {
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Normalise whatever the backend returns into what the preview UI wants.
 * This keeps the page stable even if /events/:id response differs slightly.
 */
function toUiEvent(e: ApiEvent): UiEvent {
  const title = e.title ?? 'Untitled event';
  const desc = e.description ?? '';
  const short = desc.split('\n')[0] || desc.slice(0, 160);
  const long = desc;

  const gallery = e.galleryImages ?? [];
  const hero =
    e.heroImage ||
    e.imageUrl ||
    (gallery.length ? gallery[0] : undefined);

  // Venue/address: your Prisma has venue + address + city + postalCode; list page has "location"
  const address =
    e.location ||
    [e.address, e.city, e.postalCode, e.country].filter(Boolean).join(', ') ||
    '';

  const capacity = safeNumber((e as any).capacity ?? (e as any).totalCapacity, 0);
  const ticketsSold = safeNumber(e.ticketsSold, 0);

  // Ticket tiers: prefer backend ticketTiers, else fallback to single tier using ticketPrice/serviceFee (from your list page)
  let tiers: UiTicketTier[] = [];
  if (e.ticketTiers?.length) {
    tiers = e.ticketTiers.map(t => {
      // NOTE: ticket tier price is Int in prisma -> likely pence
      const price = moneyToPounds(safeNumber((t as any).price, 0));
      const fee = 0; // not in schema yet; add later if you implement per-tier fees
      const qty = safeNumber((t as any).quantity, 0);
      const sold = safeNumber((t as any).quantitySold, 0);
      const available = Math.max(0, qty - sold);

      return {
        id: (t as any).id,
        name: (t as any).name ?? 'Tier',
        description: (t as any).description ?? undefined,
        price,
        serviceFee: fee,
        quantity: qty,
        available,
      };
    });
  } else {
    const ticketPrice = safeNumber(e.ticketPrice, 0);
    const serviceFee = safeNumber(e.serviceFee, 0);
    tiers = [
      {
        id: 'default',
        name: 'General Admission',
        price: ticketPrice,
        serviceFee,
        quantity: capacity || 0,
        available: Math.max(0, (capacity || 0) - ticketsSold),
        description: 'Standard entry',
      },
    ];
  }

  const status = (e.status ?? 'DRAFT').toUpperCase();
  const visibility: UiEvent['visibility'] =
    status === 'PUBLISHED' ? 'published' : 'draft';

  return {
    id: e.id,
    name: title,
    category: (e.category ?? 'event').toString(),
    shortDescription: short,
    longDescription: long,
    highlights: [], // not in schema yet; add later if you store JSON or a table

    eventDate: e.eventDate ?? new Date().toISOString(),
    doorsOpen: e.doorsOpen ?? undefined,
    eventEndDate: (e as any).eventEnd ?? undefined,

    venue: {
      name: e.venue ?? 'Venue',
      address,
      capacity: capacity || undefined,
    },

    heroImage: hero,
    gallery,

    ticketTiers: tiers,

    organizer: {
      name: e.organizer?.name ?? 'Organizer',
      verified: !!e.organizer?.verified,
    },

    ageRestriction: '18+',
    refundPolicy: 'Refund policy not set yet.',

    allowResale: e.allowResale ?? true,
    resaleCap: safeNumber(e.resaleCapValue, 110),
    allowTransfers: true,
    visibility,

    trainStations: [],
    parkingInfo: '',
    accessibilityNotes: '',

    faqs: [],
  };
}

export default function EventPreviewPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [eventRaw, setEventRaw] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<'saving' | 'publishing' | 'deleting' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventUi = useMemo(() => (eventRaw ? toUiEvent(eventRaw) : null), [eventRaw]);

  const [expandedSections, setExpandedSections] = useState({
    description: true,
    venue: true,
    transport: false,
    faq: false,
    refund: false,
    gallery: false,
  });

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';
        const res = await fetch(`${base}/events/${id}`, { cache: 'no-store' });
        
        if (!res.ok) throw new Error('Failed to fetch event');
        const dto = (await res.json()) as ApiEvent;

        if (cancelled) return;

        setEventRaw(dto);

        // default tier selection
        const ui = toUiEvent(dto);
        setSelectedTierId(ui.ticketTiers[0]?.id ?? null);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'Failed to load event');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const selectedTier = useMemo(() => {
    if (!eventUi) return null;
    return eventUi.ticketTiers.find((t) => t.id === selectedTierId) ?? eventUi.ticketTiers[0] ?? null;
  }, [eventUi, selectedTierId]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const ticketsSold = useMemo(() => {
    if (!eventRaw) return 0;
    const cap = safeNumber((eventRaw as any).capacity ?? (eventRaw as any).totalCapacity, 0);
    const sold = safeNumber(eventRaw.ticketsSold, 0);
    return Math.min(sold, cap || sold);
  }, [eventRaw]);

  const totalCapacity = useMemo(() => {
    if (!eventRaw) return 0;
    return safeNumber((eventRaw as any).capacity ?? (eventRaw as any).totalCapacity, 0);
  }, [eventRaw]);

  const percentSold = totalCapacity > 0 ? (ticketsSold / totalCapacity) * 100 : 0;

  const availableTickets = useMemo(() => {
    if (!eventUi) return 0;
    return eventUi.ticketTiers.reduce((sum, tier) => sum + (tier.available ?? 0), 0);
  }, [eventUi]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPrice = selectedTier ? (selectedTier.price + selectedTier.serviceFee) * quantity : 0;

const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

async function saveDraft() {
  if (!id) return;
  try {
    setBusy('saving'); setError(null);

    const res = await fetch(`${base}/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DRAFT' }),
    });
    if (!res.ok) throw new Error('Failed to save draft');

    const updated = (await res.json()) as ApiEvent;
    setEventRaw(updated);
  } catch (e: any) {
    setError(e?.message ?? 'Failed to save');
  } finally {
    setBusy(null);
  }
}

async function publish() {
  if (!id) return;
  try {
    setBusy('publishing'); setError(null);

    // try publish endpoint first
    let res = await fetch(`${base}/events/${id}/publish`, { method: 'POST' });

    // fallback to PATCH
    if (!res.ok) {
      res = await fetch(`${base}/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      });
    }

    if (!res.ok) throw new Error('Failed to publish');

    const updated = (await res.json()) as ApiEvent;
    setEventRaw(updated);
    router.push('/organizer/dashboard');
  } catch (e: any) {
    setError(e?.message ?? 'Failed to publish');
  } finally {
    setBusy(null);
  }
}

async function remove() {
  if (!id) return;
  const ok = window.confirm('Delete this event? This cannot be undone.');
  if (!ok) return;

  try {
    setBusy('deleting'); setError(null);

    const res = await fetch(`${base}/events/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');

    router.push('/organizer/dashboard');
  } catch (e: any) {
    setError(e?.message ?? 'Failed to delete');
  } finally {
    setBusy(null);
  }
}


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading event preview…</div>
      </div>
    );
  }

  if (!eventUi) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h1 className="text-white font-bold text-lg mb-2">Couldn’t load event</h1>
          <p className="text-gray-400 text-sm mb-4">{error ?? 'Unknown error'}</p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-black rounded-lg font-semibold"
            >
              Retry
            </button>
            <Link href="/organizer/dashboard" className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Preview Mode Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">Preview Mode</p>
              <p className="text-xs opacity-90">This is how buyers will see your event</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/organizer/create-event">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-semibold transition-colors">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Event</span>
              </button>
            </Link>

            <button
              onClick={saveDraft}
              disabled={busy === 'saving'}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <span>{busy === 'saving' ? 'Saving…' : 'Save'}</span>
            </button>

            <button
              onClick={publish}
              disabled={busy === 'publishing'}
              className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <Zap className="w-4 h-4" />
              <span>{busy === 'publishing' ? 'Publishing…' : 'Publish'}</span>
            </button>

            <button
              onClick={remove}
              disabled={busy === 'deleting'}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <span>{busy === 'deleting' ? 'Deleting…' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-[52px] z-40 backdrop-blur-lg bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/organizer/create-event" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Edit</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:inline">Lurexo</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Heart className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative h-[35vh] sm:h-[45vh] md:h-[55vh] overflow-hidden">
        {eventUi.heroImage ? (
          <img src={resolveEventImageSrc(eventUi.heroImage) ?? ''} alt={eventUi.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-bold uppercase backdrop-blur-sm">
            {eventUi.category}
          </span>
        </div>

        {percentSold >= 80 && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-block px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold backdrop-blur-sm">
              🔥 Selling Fast - Only {availableTickets} left
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="max-w-[900px] space-y-6 lg:space-y-8">
              {/* Title Section */}
              <div className="space-y-3">
                <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight">
                  {eventUi.name}
                </h1>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">by</span>
                  <span className="text-white text-sm font-semibold">{eventUi.organizer.name}</span>
                  {eventUi.organizer.verified && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 hover:from-purple-500/10 hover:to-purple-500/15 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-400 text-xs font-medium mb-0.5">Date</div>
                    <div className="text-white font-bold text-base">{formatDate(eventUi.eventDate)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 hover:from-purple-500/10 hover:to-purple-500/15 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-400 text-xs font-medium mb-0.5">Start Time</div>
                    <div className="text-white font-bold text-base">{formatTime(eventUi.eventDate)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/15 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-400 text-xs font-medium mb-0.5">Venue</div>
                    <div className="text-white font-bold text-base truncate">{eventUi.venue.name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/15 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-400 text-xs font-medium mb-0.5">Age</div>
                    <div className="text-white font-bold text-base">{eventUi.ageRestriction}</div>
                  </div>
                </div>
              </div>

              {/* Trust Signals Bar */}
              <div className="hidden lg:flex flex-wrap gap-4 p-4 bg-purple-900/20 border-purple-500/20 rounded-xl border">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">No hidden fees</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">Free transfers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">Digital tickets in mobile wallet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">24/7 support</span>
                </div>
              </div>

              {/* Refund Policy */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleSection('refund')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-semibold text-left">Refund Policy</h3>
                  </div>
                  {expandedSections.refund ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.refund && (
                  <div className="px-4 pb-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed">{eventUi.refundPolicy}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                <p className="text-gray-400 leading-relaxed mb-3">{eventUi.shortDescription}</p>
                {expandedSections.description && (
                  <p className="text-gray-400 leading-relaxed mb-3">{eventUi.longDescription}</p>
                )}
                <button
                  onClick={() => toggleSection('description')}
                  className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-2"
                >
                  {expandedSections.description ? 'Show less' : 'Read more'}
                  {expandedSections.description ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Venue */}
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('venue')}
                  className="w-full p-4 bg-gray-900 flex items-center justify-between hover:opacity-80 transition"
                >
                  <h2 className="text-xl font-bold text-white">Venue Information</h2>
                  {expandedSections.venue ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                </button>
                {expandedSections.venue && (
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="text-white font-semibold mb-2">{eventUi.venue.name}</h3>
                      <p className="text-gray-400 text-sm">{eventUi.venue.address}</p>
                    </div>
                    <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-gray-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('gallery')}
                  className="w-full p-4 bg-gray-900 flex items-center justify-between hover:opacity-80 transition"
                >
                  <h2 className="text-xl font-bold text-white">Photo Gallery</h2>
                  {expandedSections.gallery ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                </button>
                {expandedSections.gallery && (
                  <div className="p-4">
                    {eventUi.gallery.length === 0 ? (
                      <p className="text-gray-500 text-sm">No gallery images yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {eventUi.gallery.map((img, idx) => (
                          <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="w-full aspect-video object-cover rounded-lg" />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 sticky top-32 space-y-6">
              {/* Urgency */}
              {percentSold >= 75 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">Only {availableTickets} tickets left!</span>
                  </div>
                </div>
              )}

              {/* Ticket Selection */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Select Tickets</h3>
                <div className="space-y-3">
                  {eventUi.ticketTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition ${
                        selectedTier?.id === tier.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-white font-semibold">{tier.name}</div>
                          <div className="text-gray-400 text-sm">{tier.available} available</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-lg font-bold">£{tier.price.toFixed(2)}</div>
                          <div className="text-gray-400 text-xs">+£{tier.serviceFee.toFixed(2)} fee</div>
                        </div>
                      </div>
                      {tier.description && (
                        <p className="text-gray-500 text-xs">{tier.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block text-center">Quantity</label>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-xl font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(6, quantity + 1))}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <ChevronUp className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="pt-4 border-t border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tickets ({quantity}x)</span>
                  <span className="text-white">£{selectedTier ? (selectedTier.price * quantity).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Service fee</span>
                  <span className="text-white">£{selectedTier ? (selectedTier.serviceFee * quantity).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                  <span className="text-white">Total</span>
                  <span className="text-white">£{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-gray-500 text-xs text-center">The price you'll pay. No surprises later.</p>
              </div>

              {/* CTA */}
              <button className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition">
                Buy Tickets
              </button>

              {/* Trust Signals */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Notes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-gray-800">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            Preview Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Hero Image</p>
                <p className="text-gray-400 text-xs">{eventUi.heroImage ? 'Image uploaded' : 'No hero image yet'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Event Details</p>
                <p className="text-gray-400 text-xs">{eventUi.name ? 'Title set' : 'Title missing'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Ticket Types</p>
                <p className="text-gray-400 text-xs">{eventUi.ticketTiers.length} tiers configured</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Policies Set</p>
                <p className="text-gray-400 text-xs">Refund/transfer policies can be added later</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">Ready to publish? Your event looks great!</p>
            <button
              onClick={publish}
              disabled={busy === 'publishing'}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-60"
            >
              <Zap className="w-5 h-5" />
              <span>{busy === 'publishing' ? 'Publishing…' : 'Publish Event'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
