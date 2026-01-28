'use client';

import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import Link from 'next/link';
import { Calendar, MapPin, Check, Shield, ArrowRight } from 'lucide-react';
import { resolveEventImageSrc } from '@/lib/images';
import { eventsUrl } from "@/lib/api";

type HomeEvent = {
  id: string;
  title: string;
  heroImage?: string | null;
  category?: string | null;
  eventDate: string;
  location?: string | null;
  ticketTiers?: Array<{
    price?: number | string | null;
  }> | null;

  // optional: include only what you actually use on this page
  venue?: string | null;
  city?: string | null;
  ticketPrice?: number | string | null; // depends on your API shape
  serviceFee?: number | string | null;
};

export default function HomePage() {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState([]);

  const getEventHeroImage = (event: any): string | null => {
    return resolveEventImageSrc(event?.heroImage) ?? null;
  };

  const toNumber = (value: unknown) => {
    const n = typeof value === 'string' ? Number(value) : (value as number);
    return Number.isFinite(n) ? n : NaN;
  };

  const getBasePrice = (event: HomeEvent): number | null => {
    const tiers = Array.isArray(event.ticketTiers) ? event.ticketTiers : [];
    const tierPrices = tiers.map((tier) => toNumber(tier?.price)).filter((n) => Number.isFinite(n));
    if (tierPrices.length > 0) {
      return Math.min(...tierPrices) / 100;
    }

    const directPrice = toNumber(event.ticketPrice);
    if (Number.isFinite(directPrice)) return directPrice;

    return null;
  };

  const getServiceFee = (event: HomeEvent): number => {
    const fee = toNumber(event.serviceFee);
    return Number.isFinite(fee) ? fee : 0;
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
    }).format(value);

 useEffect(() => {
  setMounted(true);

  // Fetch first 4 events for featured section
  fetch(eventsUrl(), { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text(); // could be HTML on error
        throw new Error(`Events fetch failed ${res.status}: ${text.slice(0, 200)}`);
      }
      return res.json();
    })
    .then((data) => setFeaturedEvents((data ?? []).slice(0, 4)))
    .catch((err) => console.error("Error fetching events:", err));
}, []);
 
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const categories = [
    { name: 'Music', emoji: '🎵' },
    { name: 'Comedy', emoji: '😂' },
    { name: 'Sports', emoji: '⚽' },
    { name: 'Theatre', emoji: '🎭' },
    { name: 'Food & Drink', emoji: '🍽️' },
    { name: 'Art', emoji: '🎨' }
  ];

  // Theme classes
  const bg = isDarkMode ? 'bg-black' : 'bg-gray-50';
  const bgSecondary = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const bgGradient = isDarkMode 
    ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-black' 
    : 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700';
  const text = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const border = isDarkMode ? 'border-gray-800' : 'border-gray-200';
  const cardBg = isDarkMode ? 'from-gray-900 to-gray-800' : 'from-white to-gray-50';

  return (
    <div className={`min-h-screen ${bg}`}>
      <Navigation />

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${bgGradient}`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="mb-12 lg:mb-0">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Fair tickets for real fans
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-xl">
                No bots. No hidden fees. Just transparent ticketing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/events">
                  <button className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105">
                    Browse Events
                  </button>
                </Link>
                <Link href="/how-it-works">
                  <button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all">
                    How it Works
                  </button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Fair Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Bot-Free</span>
                </div>
              </div>
            </div>

            {/* Right: Event Image Collage */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {featuredEvents.slice(0, 4).map((event, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl overflow-hidden h-48 group cursor-pointer"
                  style={{ 
                    transform: idx === 0 ? 'translateY(-10px)' : idx === 3 ? 'translateY(10px)' : 'none'
                  }}
                >
{(() => {
  const src = getEventHeroImage(event);
  if (!src) return null;

  return (
    <img
      src={src}
      alt={event.title}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
  );
})()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className={`py-8 ${bgSecondary} border-b ${border}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* No Hidden Fees */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center relative">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="9" stroke="url(#gradient1)" strokeWidth="2" fill="none"/>
                  <path d="M8 12l3 3 5-6" stroke="url(#gradient1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={`text-xl font-bold ${text} mb-2`}>No Hidden Fees</h3>
              <p className={textSecondary}>The price you see is what you pay</p>
            </div>

            {/* Bot Protection */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2L4 6v5c0 5 3 9 8 11 5-2 8-6 8-11V6l-8-4z" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="12" cy="12" r="3" stroke="url(#gradient2)" strokeWidth="2" fill="none"/>
                  <path d="M12 12v3" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className={`text-xl font-bold ${text} mb-2`}>Bot Protection</h3>
              <p className={textSecondary}>Real fans only, verified tickets</p>
            </div>

            {/* Free Transfers */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path d="M16 3l5 5-5 5" stroke="url(#gradient3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 8H9" stroke="url(#gradient3)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 21l-5-5 5-5" stroke="url(#gradient3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 16h12" stroke="url(#gradient3)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className={`text-xl font-bold ${text} mb-2`}>Free Transfers</h3>
              <p className={textSecondary}>Life happens, transfer anytime</p>
            </div>

            {/* Fair Resale */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2L4 7l8 5 8-5-8-5z" stroke="url(#gradient4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M4 12l8 5 8-5" stroke="url(#gradient4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 17l8 5 8-5" stroke="url(#gradient4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={`text-xl font-bold ${text} mb-2`}>Fair Resale</h3>
              <p className={textSecondary}>Capped at 110% face value</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-3xl lg:text-4xl font-bold ${text}`}>Featured Events</h2>
            <Link href="/events" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold">
              View all
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event: HomeEvent) => {
              const basePrice = getBasePrice(event);
              const totalPrice = basePrice === null ? null : basePrice + getServiceFee(event);
              return (
                <Link key={event.id} href={`/events/${event.id}`} className="block h-full">
                  <div className={`h-full group relative bg-gradient-to-br ${cardBg} rounded-2xl overflow-hidden border ${border} transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col`}>
                    <div className={`relative h-48 overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20' : 'bg-gradient-to-br from-purple-100 to-blue-100'}`}>
{(() => {
  const src = getEventHeroImage(event);
  if (!src) return null;

  return (
    <img
      src={src}
      alt={event.title}
      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
    />
  );
})()}

                      <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent' : 'bg-gradient-to-t from-white via-white/40 to-transparent'}`}></div>
                      
                      {event.category && (
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 ${isDarkMode ? 'bg-black/60' : 'bg-white/90'} backdrop-blur-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} text-xs font-semibold rounded-full border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            {event.category.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className={`text-lg font-bold ${text} mb-3 group-hover:text-purple-500 transition-colors line-clamp-2`}>
                        {event.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className={`flex items-center ${textSecondary} text-sm`}>
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {event.location || [event.venue, event.city].filter(Boolean).join(' • ') || 'Location TBC'}
                          </span>
                        </div>

                        <div className={`flex items-center ${textSecondary} text-sm`}>
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{new Date(event.eventDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                          })}</span>
                        </div>
                      </div>

                      <div className={`mt-auto pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xl font-bold ${text}`}>
                              {totalPrice === null ? 'Price TBC' : formatPrice(totalPrice)}
                            </p>
                            <p className={`text-xs ${textSecondary}`}>inc. fees</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 ${bgSecondary}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl lg:text-4xl font-bold ${text} text-center mb-12`}>How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <h3 className={`text-2xl font-bold ${text} mb-3`}>Browse</h3>
              <p className={textSecondary}>Find your event from our curated selection</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">2</span>
              </div>
              <h3 className={`text-2xl font-bold ${text} mb-3`}>Buy</h3>
              <p className={textSecondary}>Fair price, secure checkout, no hidden fees</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className={`text-2xl font-bold ${text} mb-3`}>Go</h3>
              <p className={textSecondary}>Digital tickets in your mobile wallet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl lg:text-4xl font-bold ${text} text-center mb-12`}>Browse by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/events?category=${category.name.toLowerCase().replace(' & ', '-')}`}
                className={`p-6 rounded-2xl border ${border} ${bgSecondary} hover:border-purple-500 transition-all text-center group cursor-pointer`}
              >
                <div className="text-4xl mb-3">{category.emoji}</div>
                <div className={`${text} font-semibold group-hover:text-purple-500 transition-colors`}>
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* For Organizers CTA */}
      <section className={`py-20 ${bgGradient}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Run your own events?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            White-label ticketing platform for event organizers
          </p>
          <Link href="/for-organizers">
            <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
