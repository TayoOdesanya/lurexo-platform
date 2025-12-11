'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, TrendingUp, Sparkles, Moon, Smile, Palette, Coffee, Bookmark, ChevronRight, ArrowUp, Home, Ticket, User, Search, Filter } from 'lucide-react';

// Mock data for demonstration
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Summer Music Festival 2025',
    description: 'The biggest music festival of the year',
    location: 'Hyde Park, London',
    eventDate: '2025-08-15T19:00:00Z',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    ticketPrice: 85.00,
    serviceFee: 8.50,
    capacity: 5000,
    ticketsSold: 4200,
    organizer: { name: 'Live Nation' }
  },
  {
    id: '2',
    title: 'Comedy Night with Sarah Cooper',
    description: 'An evening of stand-up comedy',
    location: 'The Comedy Store, Leicester Square',
    eventDate: '2025-07-22T20:00:00Z',
    category: 'Comedy',
    imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    ticketPrice: 35.00,
    serviceFee: 3.50,
    capacity: 400,
    ticketsSold: 385,
    organizer: { name: 'Comedy Central' }
  },
  {
    id: '3',
    title: 'Late Night Jazz Session',
    description: 'Smooth jazz till midnight',
    location: 'Ronnie Scott\'s Jazz Club',
    eventDate: '2025-07-18T22:00:00Z',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
    ticketPrice: 45.00,
    serviceFee: 4.50,
    capacity: 250,
    ticketsSold: 180,
    organizer: { name: 'Jazz Collective' }
  },
  {
    id: '4',
    title: 'Juls - Afrobeats Night',
    description: 'African music sensation live',
    location: 'Electric Brixton',
    eventDate: '2025-07-22T21:00:00Z',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    ticketPrice: 30.00,
    serviceFee: 3.00,
    capacity: 1500,
    ticketsSold: 1450,
    organizer: { name: 'Afro Nation' }
  },
  {
    id: '5',
    title: 'OMW For A Night - R&B Special',
    description: 'Best R&B hits all night',
    location: 'Prince of Peckham',
    eventDate: '2025-07-14T20:00:00Z',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
    ticketPrice: 25.00,
    serviceFee: 2.50,
    capacity: 300,
    ticketsSold: 285,
    organizer: { name: 'OMW Collective' }
  },
  {
    id: '6',
    title: 'Pull Up Recordings Showcase',
    description: 'New talent showcase',
    location: 'Hootananny Brixton',
    eventDate: '2025-07-08T19:00:00Z',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    ticketPrice: 20.00,
    serviceFee: 2.00,
    capacity: 400,
    ticketsSold: 350,
    organizer: { name: 'Pull Up Records' }
  },
  {
    id: '7',
    title: 'Afro Nation United Festival',
    description: 'Biggest Afrobeats festival',
    location: 'Drumsheds',
    eventDate: '2025-07-21T18:00:00Z',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    ticketPrice: 75.00,
    serviceFee: 7.50,
    capacity: 8000,
    ticketsSold: 7800,
    organizer: { name: 'Afro Nation' }
  },
  {
    id: '8',
    title: 'Shakespeare in the Park',
    description: 'A Midsummer Night\'s Dream',
    location: 'Regent\'s Park Open Air Theatre',
    eventDate: '2025-07-25T19:30:00Z',
    category: 'Theatre',
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    ticketPrice: 42.00,
    serviceFee: 4.20,
    capacity: 1200,
    ticketsSold: 980,
    organizer: { name: 'Royal Shakespeare Company' }
  },
  {
    id: '9',
    title: 'Electronic Dreams Festival',
    description: 'Top DJs from around the world',
    location: 'Printworks London',
    eventDate: '2025-08-05T22:00:00Z',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-d220ff06767e?w=800',
    ticketPrice: 65.00,
    serviceFee: 6.50,
    capacity: 3000,
    ticketsSold: 2750,
    organizer: { name: 'Electronic Dreams' }
  },
  {
    id: '10',
    title: 'Stand-Up Saturday',
    description: 'Multiple comedians, one night',
    location: 'Soho Theatre',
    eventDate: '2025-07-16T20:00:00Z',
    category: 'Comedy',
    imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
    ticketPrice: 28.00,
    serviceFee: 2.80,
    capacity: 350,
    ticketsSold: 340,
    organizer: { name: 'Laugh Factory' }
  },
  {
    id: '11',
    title: 'Art Gallery Night',
    description: 'Contemporary art exhibition opening',
    location: 'Tate Modern',
    eventDate: '2025-07-19T18:00:00Z',
    category: 'Art',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800',
    ticketPrice: 15.00,
    serviceFee: 1.50,
    capacity: 500,
    ticketsSold: 420,
    organizer: { name: 'Tate Modern' }
  },
  {
    id: '12',
    title: 'Indie Rock Showcase',
    description: 'Emerging indie bands',
    location: 'The Garage, Highbury',
    eventDate: '2025-07-23T19:00:00Z',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800',
    ticketPrice: 22.00,
    serviceFee: 2.20,
    capacity: 600,
    ticketsSold: 480,
    organizer: { name: 'Indie Collective' }
  },
  {
    id: '13',
    title: 'Wine & Jazz Evening',
    description: 'Wine tasting with live jazz',
    location: 'Sky Garden',
    eventDate: '2025-07-27T19:00:00Z',
    category: 'Food & Drink',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    ticketPrice: 55.00,
    serviceFee: 5.50,
    capacity: 150,
    ticketsSold: 145,
    organizer: { name: 'Wine Society' }
  },
  {
    id: '14',
    title: 'Street Food Festival',
    description: 'Global street food vendors',
    location: 'Southbank Centre',
    eventDate: '2025-07-29T12:00:00Z',
    category: 'Food & Drink',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    ticketPrice: 10.00,
    serviceFee: 1.00,
    capacity: 2000,
    ticketsSold: 1650,
    organizer: { name: 'Street Feast' }
  },
  {
    id: '15',
    title: 'Poetry Slam Night',
    description: 'Spoken word performances',
    location: 'The Poetry Café',
    eventDate: '2025-07-17T20:00:00Z',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ticketPrice: 12.00,
    serviceFee: 1.20,
    capacity: 100,
    ticketsSold: 85,
    organizer: { name: 'Poets United' }
  },
  {
    id: '16',
    title: 'Techno Warehouse Party',
    description: 'Underground techno all night',
    location: 'Tobacco Dock',
    eventDate: '2025-08-12T23:00:00Z',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    ticketPrice: 40.00,
    serviceFee: 4.00,
    capacity: 2500,
    ticketsSold: 2400,
    organizer: { name: 'Warehouse Events' }
  },
  {
    id: '17',
    title: 'Acoustic Unplugged Sessions',
    description: 'Intimate acoustic performances',
    location: 'Bush Hall',
    eventDate: '2025-07-20T19:30:00Z',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800',
    ticketPrice: 32.00,
    serviceFee: 3.20,
    capacity: 300,
    ticketsSold: 275,
    organizer: { name: 'Acoustic Sessions' }
  },
  {
    id: '18',
    title: 'Improv Comedy Workshop',
    description: 'Interactive improv show',
    location: 'The Bill Murray',
    eventDate: '2025-07-24T20:00:00Z',
    category: 'Comedy',
    imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    ticketPrice: 18.00,
    serviceFee: 1.80,
    capacity: 80,
    ticketsSold: 72,
    organizer: { name: 'Improv London' }
  }
];

export default function MobileEventsPage() {
  console.log('MobileEventsPage component rendering');
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    
    // Check haptic preference from localStorage
    const hapticPref = localStorage.getItem('hapticEnabled');
    if (hapticPref !== null) {
      setHapticEnabled(hapticPref === 'true');
    }

    // Fetch events
    fetch('http://localhost:3000/events')
      .then(res => {
        console.log('Fetch response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Events fetched:', data.length, 'events');
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        console.log('Using mock data as fallback');
        // Use mock data as fallback so page still looks great
        setEvents(MOCK_EVENTS);
        setLoading(false);
      });

    // Scroll listener for "scroll to top" button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const categories = [
    { id: 'tonight', label: 'Tonight', icon: Clock },
    { id: 'week', label: 'This Week', icon: Calendar },
    { id: 'new', label: 'New Shows', icon: Sparkles },
    { id: 'trending', label: 'Most Viewed', icon: TrendingUp },
    { id: 'late', label: 'Late Night', icon: Moon },
    { id: 'comedy', label: 'Comedy', icon: Smile },
    { id: 'culture', label: 'Culture', icon: Palette },
    { id: 'chill', label: 'Chill', icon: Coffee }
  ];

  // Helper function for haptic feedback
  const triggerHaptic = () => {
    if (hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Bookmark handler
  const toggleBookmark = (eventId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newBookmarks = new Set(bookmarkedEvents);
    if (newBookmarks.has(eventId)) {
      newBookmarks.delete(eventId);
    } else {
      newBookmarks.add(eventId);
    }
    setBookmarkedEvents(newBookmarks);
    triggerHaptic();
  };

  // Filter events by category (mock logic - enhance based on real data)
  const filterEventsByCategory = (category) => {
    // This is simplified - in production, filter by actual event properties
    return events;
  };

  // Get events for different sections (safely handle empty arrays)
  const justAnnouncedEvents = events.length > 0 ? events.slice(0, 5) : [];
  const trendingEvents = events.length > 5 ? events.slice(5, 10) : [];
  const nearYouEvents = events.length > 10 ? events.slice(10, 15) : [];
  const regularCardEvents = [
    events[0] || null, 
    events[1] || null, 
    events[15] || null
  ].filter(Boolean);

  // Theme classes
    const bg = 'bg-black';
    const bgCard = 'bg-gray-900';
    const bgSecondary = 'bg-gray-800';
    const text = 'text-white';
    const textSecondary = 'text-gray-400';
    const textTertiary = 'text-gray-500';
    const border = 'border-gray-800';

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Skeleton loader component
  const SkeletonCard = ({ type = 'regular' }) => {
    if (type === 'compact') {
      return (
        <div className={`${bgCard} border ${border} rounded-xl p-3 flex gap-3 animate-pulse`}>
          <div className="w-24 h-24 bg-gray-800 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            <div className="h-3 bg-gray-800 rounded w-2/3"></div>
          </div>
        </div>
      );
    }

    return (
      <div className={`${bgCard} border ${border} rounded-2xl overflow-hidden animate-pulse`}>
        <div className="w-full h-48 bg-gray-800"></div>
        <div className="p-4 space-y-3">
          <div className="h-5 bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          <div className="h-4 bg-gray-800 rounded w-2/3"></div>
        </div>
      </div>
    );
  };

  // Regular Event Card Component
  const RegularEventCard = ({ event }) => {
    if (!event) return <SkeletonCard />;

    return (
      <Link href={`/events/${event.id}`}>
        <div className={`${bgCard} border ${border} rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] mb-6`}>
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {/* Bookmark button */}
            <button
              onClick={(e) => toggleBookmark(event.id, e)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <Bookmark 
                className={`w-5 h-5 ${bookmarkedEvents.has(event.id) ? 'fill-purple-500 text-purple-500' : 'text-white'}`}
              />
            </button>
            {/* Urgency badge */}
            {event.ticketsSold && event.capacity && (event.ticketsSold / event.capacity) > 0.8 && (
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center gap-1">
                🔥 Selling Fast
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <h3 className={`${text} font-bold text-lg line-clamp-2`}>
              {event.title}
            </h3>

            <div className="space-y-2">
              <div className={`flex items-center gap-2 ${textSecondary} text-sm`}>
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.eventDate)}</span>
              </div>

              <div className={`flex items-center gap-2 ${textSecondary} text-sm`}>
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className={`${textTertiary} text-xs`}>From</div>
                <div className={`${text} font-bold text-xl`}>
                  £{event.ticketPrice.toFixed(2)}
                </div>
              </div>
              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // Compact Event Card Component
  const CompactEventCard = ({ event, isLast = false }) => {
    if (!event) return <SkeletonCard type="compact" />;

    const ticketsLeft = event.capacity - event.ticketsSold;
    const showUrgency = ticketsLeft < 50;

    return (
      <Link href={`/events/${event.id}`}>
        <div className={`bg-transparent p-3 flex gap-3 hover:bg-gray-800/30 transition-all duration-300 active:scale-[0.98] ${!isLast ? 'border-b border-gray-800' : ''}`}>
          {/* Image */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {showUrgency && (
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">
                🔥
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h4 className={`${text} font-semibold text-sm line-clamp-1 mb-1.5`}>
                {event.title}
              </h4>
              <div className={`flex items-center gap-2 ${textSecondary} text-sm mb-1`}>
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{formatDate(event.eventDate)}</span>
              </div>
              <div className={`flex items-center gap-2 ${textSecondary} text-sm`}>
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>

            {/* Price and urgency */}
            <div className="flex items-center justify-between mt-1.5">
              <span className={`${text} font-bold text-sm`}>
                £{event.ticketPrice}
              </span>
              {showUrgency && (
                <span className="text-red-500 text-sm font-medium">
                  {ticketsLeft} left
                </span>
              )}
            </div>
          </div>

          {/* Bookmark */}
          <button
            onClick={(e) => toggleBookmark(event.id, e)}
            className="self-start flex-shrink-0"
          >
            <Bookmark 
              className={`w-5 h-5 ${bookmarkedEvents.has(event.id) ? 'fill-purple-500 text-purple-500' : textSecondary}`}
            />
          </button>
        </div>
      </Link>
    );
  };

  // Empty State Component
  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className={`${bgCard} border ${border} rounded-xl p-8 text-center`}>
      <Icon className={`w-12 h-12 ${textTertiary} mx-auto mb-3`} />
      <h3 className={`${text} font-semibold mb-2`}>{title}</h3>
      <p className={`${textSecondary} text-sm mb-4`}>{description}</p>
      <Link href="/events">
        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-semibold">
          Browse All Events
        </button>
      </Link>
    </div>
  );

  return (
    <div className={`${bg} min-h-screen pb-20`}>
      {/* Category Pills */}
      <div className={`sticky top-0 z-40 ${bgCard} border-b ${border}`}>
        <div className="overflow-x-auto hide-scrollbar" ref={scrollContainerRef}>
          <div className="flex gap-2 p-4 min-w-max">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                      : `${bgSecondary} ${textSecondary} hover:${bgCard}`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Filters Row */}
        <div className="px-4 pb-3 flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-purple-500" />
            <span className={textSecondary}>2.5km</span>
          </button>
          <button className="flex items-center gap-2 text-sm">
            <span className="text-purple-500">💰</span>
            <span className={textSecondary}>£0-50</span>
          </button>
          <button className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-purple-500" />
            <span className={textSecondary}>Filter</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <div className="space-y-3">
              <SkeletonCard type="compact" />
              <SkeletonCard type="compact" />
              <SkeletonCard type="compact" />
            </div>
          </>
        ) : (
          <>
            {/* First Regular Card */}
            {regularCardEvents[0] && (
              <RegularEventCard event={regularCardEvents[0]} />
            )}

            {/* Just Announced Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h2 className={`${text} font-bold text-lg`}>
                    Just Announced
                    <span className={`${textSecondary} text-sm font-normal ml-2`}>
                      ({justAnnouncedEvents.length} new)
                    </span>
                  </h2>
                </div>
                <Link href="/events?filter=just-announced">
                  <button className="flex items-center gap-1 text-purple-500 text-sm font-semibold">
                    See All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              <div className={`${bgCard} border ${border} rounded-xl overflow-hidden`}>
                {justAnnouncedEvents.length > 0 ? (
                  justAnnouncedEvents.map((event, index) => (
                    <CompactEventCard 
                      key={event.id} 
                      event={event} 
                      isLast={index === justAnnouncedEvents.length - 1}
                    />
                  ))
                ) : (
                  <EmptyState 
                    icon={Sparkles}
                    title="No new shows announced"
                    description="Check back soon for fresh events"
                  />
                )}
              </div>
            </div>

            {/* Second Regular Card */}
            {regularCardEvents[1] && (
              <RegularEventCard event={regularCardEvents[1]} />
            )}

            {/* Trending This Week Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  <h2 className={`${text} font-bold text-lg`}>
                    Trending This Week
                    <span className={`${textSecondary} text-sm font-normal ml-2`}>
                      (Selling fast)
                    </span>
                  </h2>
                </div>
                <Link href="/events?filter=trending">
                  <button className="flex items-center gap-1 text-purple-500 text-sm font-semibold">
                    See All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              <div className={`${bgCard} border ${border} rounded-xl overflow-hidden`}>
                {trendingEvents.length > 0 ? (
                  trendingEvents.map((event, index) => (
                    <CompactEventCard 
                      key={event.id} 
                      event={event} 
                      isLast={index === trendingEvents.length - 1}
                    />
                  ))
                ) : (
                  <EmptyState 
                    icon={TrendingUp}
                    title="No trending events"
                    description="Check back later for hot tickets"
                  />
                )}
              </div>
            </div>

            {/* Third Regular Card */}
            {regularCardEvents[2] && (
              <RegularEventCard event={regularCardEvents[2]} />
            )}

            {/* Near You Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <h2 className={`${text} font-bold text-lg`}>
                    Near You
                    <span className={`${textSecondary} text-sm font-normal ml-2`}>
                      · 2.5km
                    </span>
                  </h2>
                </div>
                <Link href="/events?filter=near-you">
                  <button className="flex items-center gap-1 text-purple-500 text-sm font-semibold">
                    See All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              <div className={`${bgCard} border ${border} rounded-xl overflow-hidden`}>
                {nearYouEvents.length > 0 ? (
                  nearYouEvents.map((event, index) => (
                    <CompactEventCard 
                      key={event.id} 
                      event={event} 
                      isLast={index === nearYouEvents.length - 1}
                    />
                  ))
                ) : (
                  <EmptyState 
                    icon={MapPin}
                    title="No nearby events"
                    description="Try expanding your search radius"
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 active:scale-95"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 ${bgCard} border-t ${border} z-50`}>
        <div className="flex items-center justify-around py-3">
          <Link href="/mobile">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <Home className="w-6 h-6 text-purple-500" /> {/* ACTIVE */}
              <span className="text-purple-500 text-xs font-semibold">Home</span>
            </button>
          </Link>

          <Link href="/tickets">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <Ticket className={`w-6 h-6 ${textSecondary}`} />
              <span className={`${textSecondary} text-xs`}>Tickets</span>
            </button>
          </Link>

          <Link href="/profile">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <User className={`w-6 h-6 ${textSecondary}`} />
              <span className={`${textSecondary} text-xs`}>Profile</span>
            </button>
          </Link>

          <Link href="/search/mobile">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <Search className={`w-6 h-6 ${textSecondary}`} />
              <span className={`${textSecondary} text-xs`}>Search</span>
            </button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}