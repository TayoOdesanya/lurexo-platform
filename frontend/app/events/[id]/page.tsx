'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

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
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return src.startsWith('/') ? src : `/${src}`;
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

<<<<<<< Updated upstream
  // Hydration guard
  useEffect(() => setMounted(true), []);
=======
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
>>>>>>> Stashed changes

  useEffect(() => {
    if (!id) return;

<<<<<<< Updated upstream
    setLoading(true);
    setError(null);

    fetch(`http://localhost:3001/api/events/${id}`)
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
=======
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };


  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${mockEvent.title} on Lurexo!`;

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
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    <div className={`min-h-screen ${bgPrimary}`}>
      {/* Top Nav */}
      <header className={`relative overflow-hidden ${bgGradient}`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
=======
    <div className={`min-h-screen ${bg} pb-24 lg:pb-0`}>
      {/* Navigation */}
      <nav className={`${bgSecondary} border-b ${border} sticky top-0 z-40 backdrop-blur-lg bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* MOBILE: Back Button */}
            <button
              onClick={() => router.back()}
              className={`lg:hidden flex items-center gap-2 ${textSecondary} hover:${text} transition-colors`}
>>>>>>> Stashed changes
            >
              ← Back
            </button>

            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
<<<<<<< Updated upstream
              <span className="text-white font-bold text-2xl tracking-tight">Lurexo</span>
            </Link>
=======
              <span className={`${text} font-bold text-xl hidden sm:inline`}>Lurexo</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${isLiked ? 'bg-red-500/10 text-red-500' : `${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} ${textSecondary}`
                  }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>

              <button
                onClick={() => setShowShareSheet(true)}
                className={`hidden sm:block p-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-all`}
              >
                <Share2 className={`w-5 h-5 ${text}`} />
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-full ${isDarkMode ? 'bg-white/10 border border-white/20' : 'bg-gray-100 border border-gray-200'} backdrop-blur-sm`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
        {/* Mobile Like & Share */}
        <div className="sm:hidden absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center ${isLiked ? 'bg-red-500/20 border border-red-500/50' : 'bg-black/40 border border-white/20'
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="max-w-[900px] space-y-6 lg:space-y-8">

              {/* Compact Title Section */}
              <div className="space-y-3">
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${text} leading-tight`}>
                  {mockEvent.title}
                </h1>

                {/* Organizer - Clickable Link */}
                <Link href={`/organizers/${mockEvent.organizer.username}`}>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition-colors group">
                    <span className={`${textSecondary} text-sm`}>by</span>
                    <span className={`${text} text-sm font-semibold group-hover:text-purple-400 transition-colors`}>
                      {mockEvent.organizer.name}
                    </span>
                    {mockEvent.organizer.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
>>>>>>> Stashed changes
                    )}
                  </div>

<<<<<<< Updated upstream
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
=======
                {/* Quick Info Cards - 4 Cards: 2x2 Grid, Purple/Blue Colors */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {/* Date */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 hover:from-purple-500/10 hover:to-purple-500/15 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <div className={`${textSecondary} text-xs font-medium mb-0.5`}>Date</div>
                      <div className={`${text} font-bold text-base`}>{formatDate(mockEvent.eventDate)}</div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 hover:from-purple-500/10 hover:to-purple-500/15 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <div className={`${textSecondary} text-xs font-medium mb-0.5`}>Start Time</div>
                      <div className={`${text} font-bold text-base`}>{formatTime(mockEvent.eventDate)}</div>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/15 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <div className={`${textSecondary} text-xs font-medium mb-0.5`}>Venue</div>
                      <div className={`${text} font-bold text-base truncate`}>{mockEvent.venue.name}</div>
                    </div>
                  </div>

                  {/* Age Restriction */}
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


                {/* Trust Signals Bar - Desktop Only */}
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

                {/* Refund Policy - Collapsible */}
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
                      <p className={`text-sm ${textSecondary} mt-3 leading-relaxed`}>{mockEvent.refundPolicy}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h2 className={`text-2xl font-bold ${text} mb-4`}>About This Event</h2>
                  <p className={`${textSecondary} leading-relaxed mb-3`}>{mockEvent.description}</p>
                  {expandedSections.description && (
                    <p className={`${textSecondary} leading-relaxed mb-3`}>{mockEvent.longDescription}</p>
                  )}
                  <button
                    onClick={() => toggleSection('description')}
                    className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-2"
                  >
                    {expandedSections.description ? 'Show less' : 'Read more'}
                    {expandedSections.description ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* What to Expect */}
                <div>
                  <h2 className={`text-2xl font-bold ${text} mb-4`}>What to Expect</h2>
                  <ul className="space-y-3">
                    {mockEvent.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className={textSecondary}>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Venue */}
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
                        <h3 className={`${text} font-semibold mb-2`}>{mockEvent.venue.name}</h3>
                        <p className={`${textSecondary} text-sm`}>{mockEvent.venue.address}</p>
                      </div>
                      <div className={`w-full h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                        <MapPin className="w-12 h-12 text-gray-500" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Transport */}
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
                          {mockEvent.transport.trains.map((station, idx) => (
                            <li key={idx} className={`${textSecondary} text-sm`}>{station}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Car className="w-5 h-5 text-purple-500" />
                          <h3 className={`${text} font-semibold`}>Parking</h3>
                        </div>
                        <p className={`${textSecondary} text-sm ml-7`}>{mockEvent.transport.parking}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQ */}
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
                      {mockEvent.faqs.map((faq, idx) => (
                        <div key={idx}>
                          <h3 className={`${text} font-semibold mb-2`}>{faq.question}</h3>
                          <p className={`${textSecondary} text-sm`}>{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gallery */}
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
                        {mockEvent.gallery.map((img, idx) => (
                          <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="w-full aspect-video object-cover rounded-lg" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Comments */}
                <div className={`border ${border} rounded-xl overflow-hidden`}>
                  <button
                    onClick={() => toggleSection('comments')}
                    className={`w-full p-4 ${bgSecondary} flex items-center justify-between hover:opacity-80 transition`}
                  >
                    <div className="flex items-center gap-2">
                      <h2 className={`text-xl font-bold ${text}`}>Comments</h2>
                      <span className={`${textSecondary} text-sm`}>({mockEvent.comments.length})</span>
                    </div>
                    {expandedSections.comments ? <ChevronUp className={`w-5 h-5 ${text}`} /> : <ChevronDown className={`w-5 h-5 ${text}`} />}
                  </button>
                  {expandedSections.comments && (
                    <div className="p-4 space-y-4">
                      {mockEvent.comments.map((comment, idx) => (
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

                {/* Similar Events - Desktop Only */}
                <div className="hidden lg:block">
                  <h2 className={`text-2xl font-bold ${text} mb-6`}>Similar Events</h2>
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 pb-4">
                      {similarEvents.map((event) => (
                        <div key={event.id} className={`flex-shrink-0 w-64 ${bgSecondary} border ${border} rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer`}>
                          <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover" />
                          <div className="p-4">
                            <h3 className={`${text} font-bold mb-2 line-clamp-2`}>{event.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className={`w-4 h-4 ${textSecondary}`} />
                              <span className={`${textSecondary} text-sm`}>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <Clock className={`w-4 h-4 ${textSecondary}`} />
                              <span className={`${textSecondary} text-sm`}>{formatTime(event.date)}</span>
                            </div>
                            <div className={`${text} font-bold text-lg`}>£{event.price.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                      onClick={() => router.push(`/checkout?event=${encodeURIComponent(event.id)}`)}
                      className="w-full bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-[1.01]"
=======
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition ${selectedTier.id === tier.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : `border-gray-700 hover:border-gray-600`
                        }`}
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      <Footer />
=======
      {/* Mobile Checkout Sheet */}
      <MobileCheckoutSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        event={mockEvent}
        ticketTiers={mockEvent.ticketTiers}
        initialTier={selectedTier}
        isDarkMode={isDarkMode}
      />

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>

      {/* Footer - Desktop Only */}
      <div className="hidden lg:block">
        <Footer />
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
