
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import MobileCheckoutSheet from '@/components/MobileCheckoutSheet';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Info,
  Shield,
  Share2,
  Heart,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Check,
  Train,
  Car,
  AlertCircle,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { resolveEventImageSrc } from '@/lib/images';
import { getApiBaseUrl } from '@/lib/apiBase';

const API_BASE_URL = getApiBaseUrl();

type Organizer = {
  id?: string | null;
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
  quantity?: number | null;
  quantitySold?: number | null;
  features?: string[];
};

type EventDto = {
  id: string;
  title: string;
  category?: string | null;
  location?: string | null;
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
    capacity?: number | null;
  } | null;

  venueName?: string | null;
  venueAddress?: string | null;
  venueCity?: string | null;
  venuePostalCode?: string | null;
  venueCountry?: string | null;
  venue?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

type EventView = {
  id: string;
  title: string;
  imageUrl: string;
  gallery: string[];
  category: string;
  eventDate: string;
  eventEndDate?: string | null;
  doorsOpen?: string | null;
  location: string;
  venue: {
    name: string;
    address: string;
    capacity: number;
  };
  description: string;
  longDescription: string;
  highlights: string[];
  ticketTiers: TicketTier[];
  organizer: Organizer;
  capacity: number;
  ticketsSold: number;
  maxTicketsPerPurchase: number;
  refundPolicy: string;
  transport: {
    trains: string[];
    parking: string;
    accessibility: string;
  };
  faqs: Array<{ question: string; answer: string }>;
  comments: Array<{ user: string; text: string; time: string }>;
};

const similarEvents = [
  {
    id: '2',
    title: 'Jazz Night Under Stars',
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400',
    date: '2025-09-20T20:00:00Z',
    price: 45.0,
  },
  {
    id: '3',
    title: 'Rock Festival 2025',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
    date: '2025-10-05T18:00:00Z',
    price: 65.0,
  },
  {
    id: '4',
    title: 'Electronic Music Showcase',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    date: '2025-09-15T21:00:00Z',
    price: 55.0,
  },
  {
    id: '5',
    title: 'Classical Orchestra Live',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400',
    date: '2025-10-12T19:30:00Z',
    price: 75.0,
  },
];

function normalizeImageSrc(src: unknown): string {
  if (!src || typeof src !== 'string') return '';
  return resolveEventImageSrc(src) ?? '';
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function toNumber(value: unknown) {
  const n = typeof value === 'string' ? Number(value) : (value as number);
  return Number.isFinite(n) ? n : NaN;
}

function getLocationText(event: EventDto | null) {
  if (!event) return '';
  if (event.location) return event.location;

  const venueName = event.venue?.name || event.venueName || event.venue || '';
  const address = event.venue?.address || event.venueAddress || event.address || '';
  const city = event.venueCity || event.city || '';
  const postal = event.venuePostalCode || event.postalCode || '';
  const country = event.venueCountry || event.country || '';

  const parts = [venueName, address, city, postal, country].filter(Boolean);
  return parts.join(' - ');
}

function mapTicketTiers(event: EventDto | null): TicketTier[] {
  if (!event) return [];
  const tiers = Array.isArray(event.ticketTiers) ? event.ticketTiers : [];

  if (tiers.length > 0) {
    return tiers.map((tier) => {
      const priceRaw = toNumber(tier.price);
      const feeRaw = toNumber(tier.serviceFee ?? 0);
      const price = Number.isFinite(priceRaw) ? priceRaw / 100 : 0;
      const serviceFee = Number.isFinite(feeRaw) ? feeRaw / 100 : 0;
      const quantity = Number.isFinite(toNumber(tier.quantity)) ? Number(tier.quantity) : undefined;
      const quantitySold = Number.isFinite(toNumber(tier.quantitySold)) ? Number(tier.quantitySold) : undefined;
      const available =
        tier.available ??
        (Number.isFinite(quantity) && Number.isFinite(quantitySold)
          ? Math.max(0, quantity - quantitySold)
          : undefined);
      return {
        ...tier,
        price,
        serviceFee,
        available,
        quantity,
        quantitySold,
      };
    });
  }

  const basePrice = toNumber(event.ticketPrice ?? 0);
  const serviceFee = toNumber(event.serviceFee ?? 0);
  const price = Number.isFinite(basePrice) ? basePrice : 0;
  const fee = Number.isFinite(serviceFee) ? serviceFee : 0;

  return [
    {
      id: 'standard',
      name: 'Standard',
      price,
      serviceFee: fee,
      available: Math.max(0, Number(event.capacity ?? 0) - Number(event.ticketsSold ?? 0)),
      features: [],
    },
  ];
}
export default function EventDetailContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDarkMode] = useState(true);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(847);
  const [isMounted, setIsMounted] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    description: false,
    venue: false,
    gallery: false,
    transport: false,
    faq: false,
    comments: false,
    refund: false,
  });

  useEffect(() => {
    setIsMounted(true);

    if (window.innerWidth >= 1024) {
      setExpandedSections((prev) => ({
        ...prev,
        venue: true,
        faq: true,
      }));
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/events/${id}`)
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

  const eventView = useMemo<EventView | null>(() => {
    if (!event) return null;

    const gallery = (event.galleryImages ?? [])
      .map((img) => normalizeImageSrc(img))
      .filter(Boolean);

    const hero =
      normalizeImageSrc(event.heroImage || event.imageUrl || gallery[0] || '') ||
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200';

    const organizer: Organizer = event.organizer ?? {
      name: 'Organizer',
      username: 'organizer',
      verified: false,
    };

    const ticketTiers = mapTicketTiers(event);

    return {
      id: event.id,
      title: event.title || 'Event',
      imageUrl: hero,
      gallery: gallery.length > 0 ? gallery : [
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
      ],
      category: event.category || 'Event',
      eventDate: event.eventDate,
      eventEndDate: event.eventEndDate ?? null,
      doorsOpen: event.doorsOpen ?? null,
      location: getLocationText(event) || 'Location TBC',
      venue: {
        name: event.venue?.name || event.venueName || event.venue || 'Venue TBC',
        address: event.venue?.address || event.venueAddress || event.address || '',
        capacity: Number(event.capacity ?? 0),
      },
      description: event.description || 'No description provided.',
      longDescription: event.longDescription || '',
      highlights: [
        'Great lineup and experiences',
        'Food and beverage vendors',
        'Verified organizer',
        'Digital tickets',
      ],
      ticketTiers,
      organizer,
      capacity: Number(event.capacity ?? 0),
      ticketsSold: Number(event.ticketsSold ?? 0),
      maxTicketsPerPurchase: 6,
      refundPolicy:
        'Full refund if event is cancelled. No refunds for change of mind. Free ticket transfers available anytime.',
      transport: {
        trains: ['Check local listings for nearby stations'],
        parking: 'Limited parking. We recommend public transport.',
        accessibility: 'Accessibility options may be available. Contact the organizer.',
      },
      faqs: [
        { question: 'What time should I arrive?', answer: 'Doors open before start time. Arrive early for entry.' },
        { question: 'Can I bring food and drinks?', answer: 'Outside food and drinks may be restricted.' },
      ],
      comments: [
        { user: 'Sarah M.', text: "Can't wait for this! Anyone else going?", time: '2 hours ago' },
        { user: 'James T.', text: 'Bought my tickets! See you there!', time: '5 hours ago' },
      ],
    };
  }, [event]);

  useEffect(() => {
    if (!eventView) return;
    setSelectedTier((prev) => prev ?? eventView.ticketTiers[0]);
  }, [eventView]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const selected = selectedTier ?? eventView?.ticketTiers[0];
  const totalPrice = selected ? (selected.price + (selected.serviceFee || 0)) * quantity : 0;

  const tierTotals = eventView?.ticketTiers.reduce(
    (acc, tier) => {
      const qty = Number.isFinite(Number(tier.quantity)) ? Number(tier.quantity) : 0;
      const sold = Number.isFinite(Number(tier.quantitySold)) ? Number(tier.quantitySold) : 0;
      const remaining = Number.isFinite(Number(tier.available))
        ? Number(tier.available)
        : Math.max(0, qty - sold);
      return {
        capacity: acc.capacity + qty,
        sold: acc.sold + sold,
        remaining: acc.remaining + remaining,
      };
    },
    { capacity: 0, sold: 0, remaining: 0 },
  );

  const totalCapacity =
    (eventView?.capacity ?? 0) > 0 ? (eventView?.capacity || 0) : (tierTotals?.capacity || 0);
  const totalSold =
    (eventView?.ticketsSold ?? 0) > 0 ? (eventView?.ticketsSold || 0) : (tierTotals?.sold || 0);

  const availableTickets =
    totalCapacity > 0 ? Math.max(0, totalCapacity - totalSold) : Math.max(0, tierTotals?.remaining || 0);
  const percentSold = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;
  const showUrgency = availableTickets <= 100 || percentSold >= 75;
  const showSocialProof = percentSold >= 50 && percentSold < 75;
  const venueMapQuery = eventView?.venue?.address || eventView?.location || '';
  const venueMapSrc = venueMapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(venueMapQuery)}&output=embed`
    : '';

  const handleShare = (platform: 'copy' | 'twitter' | 'facebook') => {
    const url = window.location.href;
    const text = eventView ? `Check out ${eventView.title} on Lurexo!` : 'Check out this event on Lurexo!';

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        setShowShareSheet(false);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const bg = isDarkMode ? 'bg-black' : 'bg-gray-50';
  const bgSecondary = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const text = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const border = isDarkMode ? 'border-gray-800' : 'border-gray-200';

  if (!isMounted) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <p className={textSecondary}>Loading event...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={textSecondary}>Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !eventView || !selected) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <p className={textSecondary}>{error || 'Event not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} pb-24 lg:pb-0`}>
      <div className="relative h-[35vh] sm:h-[45vh] md:h-[55vh] overflow-hidden">
        <img src={eventView.imageUrl} alt={eventView.title} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-black via-black/40 to-transparent' : 'bg-gradient-to-t from-white via-white/40 to-transparent'}`} />

        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-bold uppercase backdrop-blur-sm">
            {eventView.category}
          </span>
        </div>

        <div className="sm:hidden absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={handleLikeToggle}
            className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center ${
              isLiked ? 'bg-red-500/20 border border-red-500/50' : 'bg-black/40 border border-white/20'
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
          </button>
          <button
            onClick={() => setShowShareSheet(true)}
            className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center"
          >
            <Share2 className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="max-w-[900px] space-y-6 lg:space-y-8">
              <div className="space-y-3">
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${text} leading-tight`}>
                  {eventView.title}
                </h1>

                <Link href={`/organizer/${eventView.organizer.id || eventView.organizer.username}`}>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition-colors group">
                    <span className={`${textSecondary} text-sm`}>by</span>
                    <span className={`${text} text-sm font-semibold group-hover:text-purple-400 transition-colors`}>
                      {eventView.organizer.name}
                    </span>
                    {eventView.organizer.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </Link>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 hover:from-purple-500/10 hover:to-purple-500/15 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <div className={`${textSecondary} text-xs font-medium mb-0.5`}>Date</div>
                      <div className={`${text} font-bold text-base`}>{formatDate(eventView.eventDate)}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 hover:from-purple-500/10 hover:to-purple-500/15 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <div className={`${textSecondary} text-xs font-medium mb-0.5`}>Start Time</div>
                      <div className={`${text} font-bold text-base`}>{formatTime(eventView.eventDate)}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/15 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <div className={`${textSecondary} text-xs font-medium mb-0.5`}>Venue</div>
                      <div className={`${text} font-bold text-base truncate`}>{eventView.venue.name}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/15 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <div className={`${textSecondary} text-xs font-medium mb-0.5`}>Age</div>
                      <div className={`${text} font-bold text-base`}>18+</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`hidden lg:flex flex-wrap gap-4 p-4 ${isDarkMode ? 'bg-purple-900/20 border-purple-500/20' : 'bg-purple-50 border-purple-200'} rounded-xl border`}>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className={textSecondary}>No hidden fees</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className={textSecondary}>Free transfers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className={textSecondary}>Digital tickets in mobile wallet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className={textSecondary}>24/7 support</span>
                </div>
              </div>

              <div className={`${bgSecondary} rounded-xl border ${border} overflow-hidden`}>
                <button
                  onClick={() => toggleSection('refund')}
                  className="w-full p-4 flex items-center justify-between hover:bg-opacity-80 transition"
                >
                  <div className="flex items-center gap-3">
                    <Info className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h3 className={`${text} font-semibold text-left`}>Refund Policy</h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 ${textSecondary} transition-transform ${expandedSections.refund ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections.refund && (
                  <div className={`px-4 pb-4 border-t ${border}`}>
                    <p className={`text-sm ${textSecondary} mt-3 leading-relaxed`}>{eventView.refundPolicy}</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className={`text-2xl font-bold ${text} mb-4`}>About This Event</h2>
                <p className={`${textSecondary} leading-relaxed mb-3`}>{eventView.description}</p>
                {expandedSections.description && eventView.longDescription && (
                  <p className={`${textSecondary} leading-relaxed mb-3`}>{eventView.longDescription}</p>
                )}
                <button
                  onClick={() => toggleSection('description')}
                  className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-2"
                >
                  {expandedSections.description ? 'Show less' : 'Read more'}
                  {expandedSections.description ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <h2 className={`text-2xl font-bold ${text} mb-4`}>What to Expect</h2>
                <ul className="space-y-3">
                  {eventView.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className={textSecondary}>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`border ${border} rounded-xl overflow-hidden`}>
                <button
                  onClick={() => toggleSection('venue')}
                  className={`w-full p-4 ${bgSecondary} flex items-center justify-between hover:opacity-80 transition`}
                >
                  <h2 className={`text-xl font-bold ${text}`}>Venue Information</h2>
                  {expandedSections.venue ? <ChevronUp className={`w-5 h-5 ${text}`} /> : <ChevronDown className={`w-5 h-5 ${text}`} />}
                </button>
                {expandedSections.venue && (
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className={`${text} font-semibold mb-2`}>{eventView.venue.name}</h3>
                      <p className={`${textSecondary} text-sm`}>{eventView.venue.address || eventView.location}</p>
                    </div>
                    {venueMapSrc ? (
                      <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-700/50">
                        <iframe
                          title="Venue map"
                          src={venueMapSrc}
                          className="w-full h-full"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    ) : (
                      <div className={`w-full h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                        <MapPin className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={`border ${border} rounded-xl overflow-hidden`}>
                <button
                  onClick={() => toggleSection('transport')}
                  className={`w-full p-4 ${bgSecondary} flex items-center justify-between hover:opacity-80 transition`}
                >
                  <h2 className={`text-xl font-bold ${text}`}>Getting There</h2>
                  {expandedSections.transport ? <ChevronUp className={`w-5 h-5 ${text}`} /> : <ChevronDown className={`w-5 h-5 ${text}`} />}
                </button>
                {expandedSections.transport && (
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Train className="w-5 h-5 text-purple-500" />
                        <h3 className={`${text} font-semibold`}>Nearest Train Stations</h3>
                      </div>
                      <ul className="space-y-2 ml-7">
                        {eventView.transport.trains.map((station, idx) => (
                          <li key={idx} className={`${textSecondary} text-sm`}>{station}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Car className="w-5 h-5 text-purple-500" />
                        <h3 className={`${text} font-semibold`}>Parking</h3>
                      </div>
                      <p className={`${textSecondary} text-sm ml-7`}>{eventView.transport.parking}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className={`border ${border} rounded-xl overflow-hidden`}>
                <button
                  onClick={() => toggleSection('faq')}
                  className={`w-full p-4 ${bgSecondary} flex items-center justify-between hover:opacity-80 transition`}
                >
                  <h2 className={`text-xl font-bold ${text}`}>FAQ</h2>
                  {expandedSections.faq ? <ChevronUp className={`w-5 h-5 ${text}`} /> : <ChevronDown className={`w-5 h-5 ${text}`} />}
                </button>
                {expandedSections.faq && (
                  <div className="p-4 space-y-4">
                    {eventView.faqs.map((faq, idx) => (
                      <div key={idx}>
                        <h3 className={`${text} font-semibold mb-2`}>{faq.question}</h3>
                        <p className={`${textSecondary} text-sm`}>{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`border ${border} rounded-xl overflow-hidden`}>
                <button
                  onClick={() => toggleSection('gallery')}
                  className={`w-full p-4 ${bgSecondary} flex items-center justify-between hover:opacity-80 transition`}
                >
                  <h2 className={`text-xl font-bold ${text}`}>Photo Gallery</h2>
                  {expandedSections.gallery ? <ChevronUp className={`w-5 h-5 ${text}`} /> : <ChevronDown className={`w-5 h-5 ${text}`} />}
                </button>
                {expandedSections.gallery && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {eventView.gallery.map((img, idx) => (
                        <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="w-full aspect-video object-cover rounded-lg" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={`border ${border} rounded-xl overflow-hidden`}>
                <button
                  onClick={() => toggleSection('comments')}
                  className={`w-full p-4 ${bgSecondary} flex items-center justify-between hover:opacity-80 transition`}
                >
                  <div className="flex items-center gap-2">
                    <h2 className={`text-xl font-bold ${text}`}>Comments</h2>
                    <span className={`${textSecondary} text-sm`}>({eventView.comments.length})</span>
                  </div>
                  {expandedSections.comments ? <ChevronUp className={`w-5 h-5 ${text}`} /> : <ChevronDown className={`w-5 h-5 ${text}`} />}
                </button>
                {expandedSections.comments && (
                  <div className="p-4 space-y-4">
                    {eventView.comments.map((comment, idx) => (
                      <div key={idx} className={`pb-4 border-b ${border} last:border-0`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{comment.user[0]}</span>
                          </div>
                          <div>
                            <div className={`${text} font-semibold text-sm`}>{comment.user}</div>
                            <div className={`${textSecondary} text-xs`}>{comment.time}</div>
                          </div>
                        </div>
                        <p className={`${textSecondary} text-sm ml-10`}>{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden lg:block">
                <h2 className={`text-2xl font-bold ${text} mb-6`}>Similar Events</h2>
                <div className="overflow-x-auto">
                  <div className="flex gap-4 pb-4">
                    {similarEvents.map((similar) => (
                      <div key={similar.id} className={`flex-shrink-0 w-64 ${bgSecondary} border ${border} rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer`}>
                        <img src={similar.imageUrl} alt={similar.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                          <h3 className={`${text} font-bold mb-2 line-clamp-2`}>{similar.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className={`w-4 h-4 ${textSecondary}`} />
                            <span className={`${textSecondary} text-sm`}>{formatDate(similar.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className={`w-4 h-4 ${textSecondary}`} />
                            <span className={`${textSecondary} text-sm`}>{formatTime(similar.date)}</span>
                          </div>
                          <div className={`${text} font-bold text-lg`}>GBP {similar.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className={`${bgSecondary} rounded-2xl p-6 border ${border} sticky top-24 space-y-6`}>
              {showUrgency && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">Only {availableTickets} tickets left!</span>
                  </div>
                </div>
              )}

              {showSocialProof && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold text-sm">Join {eventView.ticketsSold.toLocaleString()} people going</span>
                  </div>
                </div>
              )}

              <div>
                <h3 className={`text-xl font-bold ${text} mb-4`}>Select Tickets</h3>
                <div className="space-y-3">
                  {eventView.ticketTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition ${
                        selected.id === tier.id ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className={`${text} font-semibold`}>{tier.name}</div>
                          <div className={`${textSecondary} text-sm`}>{tier.available ?? 0} available</div>
                        </div>
                        <div className="text-right">
                          <div className={`${text} text-lg font-bold`}>GBP {tier.price.toFixed(2)}</div>
                          <div className={`${textSecondary} text-xs`}>+GBP {(tier.serviceFee || 0).toFixed(2)} fee</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`${textSecondary} text-sm mb-2 block text-center`}>Quantity</label>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`text-xl font-bold ${text}`}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(eventView.maxTicketsPerPurchase, quantity + 1))}
                    className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className={`pt-4 border-t ${border} space-y-2`}>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Tickets ({quantity}x)</span>
                  <span className={text}>GBP {(selected.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Service fee</span>
                  <span className={text}>GBP {((selected.serviceFee || 0) * quantity).toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-lg font-bold pt-2 border-t ${border}`}>
                  <span className={text}>Total</span>
                  <span className={text}>GBP {totalPrice.toFixed(2)}</span>
                </div>
                <p className={`${textSecondary} text-xs text-center`}>The price you will pay. No surprises later.</p>
              </div>

              <button
                onClick={() => {
                  const checkoutData = {
                    eventId: eventView.id,
                    eventTitle: eventView.title,
                    eventImage: eventView.imageUrl,
                    eventDate: eventView.eventDate,
                    eventLocation: eventView.location,
                    tierName: selected.name,
                    tierId: selected.id,
                    ticketPrice: selected.price,
                    serviceFee: selected.serviceFee || 0,
                    quantity: quantity,
                    subtotal: selected.price * quantity,
                    totalFees: (selected.serviceFee || 0) * quantity,
                    total: totalPrice,
                  };

                  localStorage.setItem('lurexo_checkout', JSON.stringify(checkoutData));

                  const params = new URLSearchParams({
                    event: eventView.id,
                    tier: selected.id,
                    qty: quantity.toString(),
                    price: selected.price.toString(),
                    fee: (selected.serviceFee || 0).toString(),
                  });

                  router.push(`/checkout?${params.toString()}`);
                }}
                className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition"
              >
                Buy Tickets
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className={textSecondary}>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${bgSecondary} border-t ${border} p-4 z-30`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-xs ${textSecondary}`}>From</p>
            <p className={`text-2xl font-bold ${text}`}>GBP {selected.price.toFixed(2)}</p>
            <p className={`text-xs ${textSecondary}`}>No surprises later</p>
          </div>
          <button
            onClick={() => setShowBottomSheet(true)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold"
          >
            Get Tickets
          </button>
        </div>
      </div>

      {showShareSheet && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowShareSheet(false)} />
          <div className={`fixed bottom-0 left-0 right-0 ${bgSecondary} rounded-t-3xl z-50 animate-slide-up`}>
            <div className="flex justify-center pt-3 pb-2">
              <div className={`w-12 h-1 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-300'} rounded-full`} />
            </div>
            <div className="p-6">
              <h2 className={`text-2xl font-bold ${text} mb-6`}>Share Event</h2>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <Share2 className="w-8 h-8 text-white" />
                  </div>
                  <span className={`${textSecondary} text-xs`}>Facebook</span>
                </button>
                <button onClick={() => handleShare('twitter')} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <Share2 className="w-8 h-8 text-white" />
                  </div>
                  <span className={`${textSecondary} text-xs`}>X</span>
                </button>
                <button onClick={() => handleShare('copy')} className="flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                    <Share2 className={`w-8 h-8 ${text}`} />
                  </div>
                  <span className={`${textSecondary} text-xs`}>Copy</span>
                </button>
              </div>
              <button onClick={() => setShowShareSheet(false)} className={`w-full py-3 rounded-xl font-semibold ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} ${text}`}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      <MobileCheckoutSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        event={eventView}
        ticketTiers={eventView.ticketTiers}
        initialTier={selected}
        isDarkMode={isDarkMode}
      />

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>

    </div>
  );
}
