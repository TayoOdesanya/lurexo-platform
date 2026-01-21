'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import MobileCheckoutSheet from '@/components/MobileCheckoutSheet';
import { Calendar, MapPin, Clock, Users, Info, Shield, Share2, Heart, ChevronDown, ChevronUp, X, Minus, Plus, Check, Train, Car, AlertCircle, MessageCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

// Mock event data
const mockEvent = {
  id: '1',
  title: 'Summer Music Festival 2025',
  imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
  gallery: [
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800'
  ],
  category: 'Music',
  eventDate: '2025-08-15T19:00:00Z',
  eventEndDate: '2025-08-15T23:00:00Z',
  doorsOpen: '2025-08-15T18:00:00Z',
  location: 'Hyde Park, London',
  venue: {
    name: 'Hyde Park',
    address: 'Hyde Park, London W2 2UH',
    capacity: 65000
  },
  description: 'Join us for an unforgettable evening of live music featuring top artists from around the world. Experience world-class performances in the heart of London.',
  longDescription: 'Get ready for the biggest music event of the summer! Our Summer Music Festival brings together incredible talent, stunning production, and an atmosphere like no other. Dance under the stars, enjoy gourmet food trucks, and create memories that will last a lifetime.',
  highlights: [
    'Headlining performances by international artists',
    'Multiple stages with diverse genres',
    'Gourmet food & beverage vendors',
    'VIP lounges with premium amenities'
  ],
  ticketTiers: [
    {
      id: 'general',
      name: 'General Admission',
      price: 85.00,
      serviceFee: 8.50,
      available: 1250,
      features: ['General standing area', 'Access to food courts', 'Standard facilities']
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 185.00,
      serviceFee: 18.50,
      available: 85,
      features: ['Premium viewing area', 'VIP lounge access', 'Complimentary drinks']
    }
  ],
  organizer: {
    name: 'Live Nation UK',
    username: 'live-nation',
    verified: true
  },
  capacity: 65000,
  ticketsSold: 58750,
  maxTicketsPerPurchase: 6,
  refundPolicy: 'Full refund if event is cancelled. No refunds for change of mind. Free ticket transfers available anytime.',
  transport: {
    trains: ['Hyde Park Corner Station (5 min walk)', 'Marble Arch Station (8 min walk)'],
    parking: 'Limited street parking. We recommend using public transport.',
    accessibility: 'Wheelchair accessible. Dedicated viewing areas available.'
  },
  faqs: [
    { question: 'What time should I arrive?', answer: 'Doors open at 6:00 PM. We recommend arriving early.' },
    { question: 'Can I bring food and drinks?', answer: 'No outside food or drinks allowed. Vendors available inside.' }
  ],
  comments: [
    { user: 'Sarah M.', text: 'Can\'t wait for this! Anyone else going?', time: '2 hours ago' },
    { user: 'James T.', text: 'Bought my tickets! See you there!', time: '5 hours ago' }
  ]
};

// Similar events mock data
const similarEvents = [
  {
    id: '2',
    title: 'Jazz Night Under Stars',
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400',
    date: '2025-09-20T20:00:00Z',
    price: 45.00
  },
  {
    id: '3',
    title: 'Rock Festival 2025',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
    date: '2025-10-05T18:00:00Z',
    price: 65.00
  },
  {
    id: '4',
    title: 'Electronic Music Showcase',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    date: '2025-09-15T21:00:00Z',
    price: 55.00
  },
  {
    id: '5',
    title: 'Classical Orchestra Live',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400',
    date: '2025-10-12T19:30:00Z',
    price: 75.00
  }
];

export default function EventDetailPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedTier, setSelectedTier] = useState(mockEvent.ticketTiers[0]);
  const [quantity, setQuantity] = useState(1);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(847);
  const [isMounted, setIsMounted] = useState(false);
  
  // FIXED: Initialize with simple false values
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    venue: false,
    gallery: false,
    transport: false,
    faq: false,
    comments: false,
    refund: false
  });

  // FIXED: Use useEffect to set desktop defaults after mount
  useEffect(() => {
    setIsMounted(true);
    
    // Only expand certain sections on desktop after component mounts
    if (window.innerWidth >= 1024) {
      setExpandedSections(prev => ({
        ...prev,
        venue: true,
        faq: true
      }));
    }
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const totalPrice = (selectedTier.price + selectedTier.serviceFee) * quantity;
  const availableTickets = mockEvent.capacity - mockEvent.ticketsSold;
  const percentSold = (mockEvent.ticketsSold / mockEvent.capacity) * 100;
  const showUrgency = availableTickets <= 100 || percentSold >= 75;
  const showSocialProof = percentSold >= 50 && percentSold < 75;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const handleShare = (platform: 'copy' | 'twitter' | 'facebook') => {
    const url = window.location.href;
    const text = `Check out ${mockEvent.title} on Lurexo!`;
    
    switch(platform) {
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
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // Theme classes
  const bg = isDarkMode ? 'bg-black' : 'bg-gray-50';
  const bgSecondary = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const text = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const border = isDarkMode ? 'border-gray-800' : 'border-gray-200';

  // Prevent hydration issues - don't render certain features until mounted
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

  return (
    <div className={`min-h-screen ${bg} pb-24 lg:pb-0`}>
      {/* Navigation */}
      <nav className={`${bgSecondary} border-b ${border} sticky top-0 z-40 backdrop-blur-lg bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* MOBILE: Back Button */}
            <button 
              onClick={() => router.back()} 
              className={`lg:hidden flex items-center gap-2 ${textSecondary} hover:${text} transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            {/* DESKTOP: Breadcrumb */}
            <div className="hidden lg:flex items-center space-x-2 text-sm">
              <Link href="/" className={`${textSecondary} hover:${text} transition-colors`}>
                Home
              </Link>
              <span className={textSecondary}>/</span>
              <Link href="/events" className={`${textSecondary} hover:${text} transition-colors`}>
                Events
              </Link>
              <span className={textSecondary}>/</span>
              <span className={text}>Event</span>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className={`${text} font-bold text-xl hidden sm:inline`}>Lurexo</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLikeToggle}
                className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  isLiked ? 'bg-red-500/10 text-red-500' : `${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} ${textSecondary}`
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
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative h-[35vh] sm:h-[45vh] md:h-[55vh] overflow-hidden">
        <img src={mockEvent.imageUrl} alt={mockEvent.title} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-black via-black/40 to-transparent' : 'bg-gradient-to-t from-white via-white/40 to-transparent'}`} />

        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-bold uppercase backdrop-blur-sm">
            {mockEvent.category}
          </span>
        </div>

        {/* Mobile Like & Share */}
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
                    )}
                  </div>
                </Link>

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
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className={`${bgSecondary} rounded-2xl p-6 border ${border} sticky top-24 space-y-6`}>
              {/* Smart Urgency */}
              {showUrgency && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">Only {availableTickets} tickets left!</span>
                  </div>
                </div>
              )}

              {/* Social Proof */}
              {showSocialProof && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold text-sm">Join {mockEvent.ticketsSold.toLocaleString()} people going</span>
                  </div>
                </div>
              )}

              {/* Ticket Selection */}
              <div>
                <h3 className={`text-xl font-bold ${text} mb-4`}>Select Tickets</h3>
                <div className="space-y-3">
                  {mockEvent.ticketTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition ${
                        selectedTier.id === tier.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : `border-gray-700 hover:border-gray-600`
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className={`${text} font-semibold`}>{tier.name}</div>
                          <div className={`${textSecondary} text-sm`}>{tier.available} available</div>
                        </div>
                        <div className="text-right">
                          <div className={`${text} text-lg font-bold`}>£{tier.price.toFixed(2)}</div>
                          <div className={`${textSecondary} text-xs`}>+£{tier.serviceFee.toFixed(2)} fee</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
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
                    onClick={() => setQuantity(Math.min(mockEvent.maxTicketsPerPurchase, quantity + 1))}
                    className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className={`pt-4 border-t ${border} space-y-2`}>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Tickets ({quantity}x)</span>
                  <span className={text}>£{(selectedTier.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Service fee</span>
                  <span className={text}>£{(selectedTier.serviceFee * quantity).toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-lg font-bold pt-2 border-t ${border}`}>
                  <span className={text}>Total</span>
                  <span className={text}>£{totalPrice.toFixed(2)}</span>
                </div>
                <p className={`${textSecondary} text-xs text-center`}>The price you'll pay. No surprises later.</p>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  // Prepare checkout data
                  const checkoutData = {
                    eventId: mockEvent.id,
                    eventTitle: mockEvent.title,
                    eventImage: mockEvent.imageUrl,
                    eventDate: mockEvent.eventDate,
                    eventLocation: mockEvent.location,
                    tierName: selectedTier.name,
                    tierId: selectedTier.id,
                    ticketPrice: selectedTier.price,
                    serviceFee: selectedTier.serviceFee,
                    quantity: quantity,
                    subtotal: selectedTier.price * quantity,
                    totalFees: selectedTier.serviceFee * quantity,
                    total: (selectedTier.price + selectedTier.serviceFee) * quantity
                  };

                  // Save to localStorage
                  localStorage.setItem('lurexo_checkout', JSON.stringify(checkoutData));

                  // Navigate with URL params
                  const params = new URLSearchParams({
                    event: mockEvent.id,
                    tier: selectedTier.id,
                    qty: quantity.toString(),
                    price: selectedTier.price.toString(),
                    fee: selectedTier.serviceFee.toString()
                  });

                  router.push(`/checkout?${params.toString()}`);
                }}
                className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition"
              >
                Buy Tickets
              </button>

              {/* Trust Signals */}
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

      {/* Mobile Bottom Bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${bgSecondary} border-t ${border} p-4 z-30`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-xs ${textSecondary}`}>From</p>
            <p className={`text-2xl font-bold ${text}`}>£{selectedTier.price.toFixed(2)}</p>
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

      {/* Share Sheet */}
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
    </div>
  );
}