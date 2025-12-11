'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Mic, 
  Home,
  X, 
  MapPin, 
  Calendar, 
  Filter as FilterIcon,
  Clock,
  TrendingUp,
  Sparkles,
  Home as HomeIcon,
  Ticket,
  User,
  Bookmark,
  ChevronDown,
  Music,
  Smile,
  Theater,
  Palette,
  Coffee,
  Flame,
  Map as MapIcon,
  List
} from 'lucide-react';

// Mock data - same as events page
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
    ticketPrice: 65.00,
    serviceFee: 6.50,
    capacity: 10000,
    ticketsSold: 9500,
    organizer: { name: 'Afro Nation' }
  },
  {
    id: '8',
    title: 'Shakespeare in the Park',
    description: 'Outdoor theatre performance',
    location: 'Regent\'s Park Open Air Theatre',
    eventDate: '2025-08-05T19:30:00Z',
    category: 'Theatre',
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    ticketPrice: 40.00,
    serviceFee: 4.00,
    capacity: 1200,
    ticketsSold: 950,
    organizer: { name: 'Open Air Theatre' }
  },
  {
    id: '9',
    title: 'Art Gallery Night',
    description: 'Late night gallery opening',
    location: 'Tate Modern',
    eventDate: '2025-07-25T18:00:00Z',
    category: 'Art',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    ticketPrice: 15.00,
    serviceFee: 1.50,
    capacity: 800,
    ticketsSold: 650,
    organizer: { name: 'Tate' }
  },
  {
    id: '10',
    title: 'Street Food Festival',
    description: 'International food vendors',
    location: 'Southbank Centre',
    eventDate: '2025-08-01T12:00:00Z',
    category: 'Food & Drink',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    ticketPrice: 10.00,
    serviceFee: 1.00,
    capacity: 2000,
    ticketsSold: 1650,
    organizer: { name: 'Street Feast' }
  },
  {
    id: '11',
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
    id: '12',
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
    id: '13',
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
    id: '14',
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

export default function MobileSearchPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(MOCK_EVENTS);
  const [recentSearches, setRecentSearches] = useState([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  
  const searchInputRef = useRef(null);
  const filterSheetRef = useRef(null);
  const startY = useRef(0);

  const [filters, setFilters] = useState({
    location: '2.5km',
    priceMin: 0,
    priceMax: 100,
    date: 'any',
    categories: []
  });

  // Saved locations
  const [savedLocations, setSavedLocations] = useState({
    home: 'London, UK',
    work: 'Canary Wharf, London',
    saved: []
  });
  const [activeLocation, setActiveLocation] = useState('current');

  useEffect(() => {
    setMounted(true);
    
    // Load recent searches from localStorage or use mock data
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    } else {
      // Mock recent searches for demo
      const mockRecentSearches = [
        'Juls',
        'Comedy shows London',
        'Electric Brixton',
        'Jazz music',
        'Weekend events'
      ];
      setRecentSearches(mockRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(mockRecentSearches));
    }

    // Load haptic preference
    const hapticPref = localStorage.getItem('hapticEnabled');
    if (hapticPref !== null) {
      setHapticEnabled(hapticPref === 'true');
    }

    // Load saved locations
    const storedLocations = localStorage.getItem('savedLocations');
    if (storedLocations) {
      setSavedLocations(JSON.parse(storedLocations));
    }

    // Auto-focus search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Real-time search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setFilteredEvents(MOCK_EVENTS);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = (query) => {
    const lowercaseQuery = query.toLowerCase();
    const results = MOCK_EVENTS.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.location.toLowerCase().includes(lowercaseQuery) ||
      event.category.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredEvents(results);
  };

  const addToRecentSearches = (query) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredEvents(MOCK_EVENTS);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        addToRecentSearches(transcript);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in your browser');
    }
  };

  const triggerHaptic = () => {
    if (hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

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

  // Filter sheet touch handlers
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    // Only allow downward swipe to close
    if (diff > 50) {
      setShowFilterSheet(false);
    }
  };

  const applyFilters = () => {
    // Apply filter logic here
    let results = MOCK_EVENTS;

    // Price filter
    results = results.filter(event => 
      event.ticketPrice >= filters.priceMin && 
      event.ticketPrice <= filters.priceMax
    );

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter(event => 
        filters.categories.includes(event.category)
      );
    }

    setFilteredEvents(results);
    setShowFilterSheet(false);
  };

  const clearAllFilters = () => {
    setFilters({
      location: '2.5km',
      priceMin: 0,
      priceMax: 100,
      date: 'any',
      categories: []
    });
    setFilteredEvents(MOCK_EVENTS);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Theme classes
  const bg = isDarkMode ? 'bg-black' : 'bg-gray-50';
  const bgCard = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
  const text = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const textTertiary = isDarkMode ? 'text-gray-500' : 'text-gray-500';
  const border = isDarkMode ? 'border-gray-800' : 'border-gray-200';

  // Compact Event Card
  const CompactEventCard = ({ event, isLast = false }) => {
    const ticketsLeft = event.capacity - event.ticketsSold;
    const showUrgency = ticketsLeft < 50;

    return (
      <Link href={`/events/${event.id}`}>
        <div className={`bg-transparent p-3 flex gap-3 hover:bg-gray-800/30 transition-all duration-300 active:scale-[0.98] ${!isLast ? 'border-b border-gray-800' : ''}`}>
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

  const categories = [
    { id: 'Music', label: 'Music', icon: Music, color: 'purple' },
    { id: 'Comedy', label: 'Comedy', icon: Smile, color: 'orange' },
    { id: 'Theatre', label: 'Theatre', icon: Theater, color: 'blue' },
    { id: 'Art', label: 'Art', icon: Palette, color: 'pink' },
    { id: 'Food & Drink', label: 'Food', icon: Coffee, color: 'green' }
  ];

  const toggleCategory = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={`${bg} min-h-screen pb-20`}>
      {/* Search Bar - Sticky */}
      <div className={`sticky top-0 z-50 ${bgCard} border-b ${border}`}>
        {/* Search Input Row */}
        <div className="p-4 flex items-center gap-3">
          <Link href="/events/mobile">
            <button className={`${textSecondary} hover:${text} transition-colors`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </Link>

          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => searchQuery && addToRecentSearches(searchQuery)}
              placeholder="Search events, artists, venues..."
              className={`w-full pl-10 pr-20 py-3 ${bgSecondary} ${text} rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button onClick={clearSearch} className={`${textSecondary} hover:${text}`}>
                  <X className="w-5 h-5" />
                </button>
              )}
              <button onClick={handleVoiceSearch} className="text-purple-500 hover:text-purple-400">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* View Toggle - Right of Search Bar */}
          <div className={`flex items-center gap-1.5 ${bgSecondary} rounded-lg p-1`}>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                  : `text-gray-400 hover:text-white`
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'map' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                  : `text-gray-400 hover:text-white`
              }`}
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setShowFilterSheet(true)}
            className={`flex items-center gap-1.5 px-3 py-2 ${bgSecondary} rounded-full text-sm font-medium whitespace-nowrap`}
          >
            <MapPin className="w-4 h-4 text-purple-500" />
            <span className={textSecondary}>{filters.location}</span>
          </button>
          
          <button
            onClick={() => setShowFilterSheet(true)}
            className={`flex items-center gap-1.5 px-3 py-2 ${bgSecondary} rounded-full text-sm font-medium whitespace-nowrap`}
          >
            <span className="text-purple-500">💰</span>
            <span className={textSecondary}>£{filters.priceMin}-{filters.priceMax}</span>
          </button>
          
          <button
            onClick={() => setShowFilterSheet(true)}
            className={`flex items-center gap-1.5 px-3 py-2 ${bgSecondary} rounded-full text-sm font-medium whitespace-nowrap`}
          >
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className={textSecondary}>{filters.date === 'any' ? 'Any date' : filters.date}</span>
          </button>
          
          <button
            onClick={() => setShowFilterSheet(true)}
            className={`flex items-center gap-1.5 px-3 py-2 ${bgSecondary} rounded-full text-sm font-medium whitespace-nowrap`}
          >
            <FilterIcon className="w-4 h-4 text-purple-500" />
            <span className={textSecondary}>
              {filters.categories.length > 0 ? `${filters.categories.length} filters` : 'All'}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {viewMode === 'list' ? (
          <>
            {/* Recent Searches - Show when no query */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="mb-6">
                <h2 className={`${text} font-bold text-lg mb-3 flex items-center gap-2`}>
                  <Clock className="w-5 h-5" />
                  Recent Searches
                </h2>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className={`w-full flex items-center justify-between p-3 ${bgCard} border ${border} rounded-lg hover:border-purple-500/50 transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <Search className={`w-4 h-4 ${textSecondary}`} />
                        <span className={text}>{search}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecentSearches(prev => prev.filter(s => s !== search));
                          localStorage.setItem('recentSearches', JSON.stringify(recentSearches.filter(s => s !== search)));
                        }}
                        className={textSecondary}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {searchQuery && (
              <div className="mb-4">
                <h3 className={`${textSecondary} text-sm`}>
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                </h3>
              </div>
            )}

            {filteredEvents.length > 0 ? (
              <div className={`${bgCard} border ${border} rounded-xl overflow-hidden`}>
                {filteredEvents.map((event, index) => (
                  <CompactEventCard 
                    key={event.id} 
                    event={event}
                    isLast={index === filteredEvents.length - 1}
                  />
                ))}
              </div>
            ) : searchQuery ? (
              <div className={`${bgCard} border ${border} rounded-xl p-8 text-center`}>
                <Search className={`w-12 h-12 ${textTertiary} mx-auto mb-3`} />
                <h3 className={`${text} font-semibold mb-2`}>No events found</h3>
                <p className={`${textSecondary} text-sm mb-4`}>
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            ) : null}
          </>
        ) : (
          /* Map View Placeholder */
          <div className={`${bgCard} border ${border} rounded-xl p-12 text-center`}>
            <MapIcon className={`w-16 h-16 ${textTertiary} mx-auto mb-4`} />
            <h3 className={`${text} font-bold text-xl mb-2`}>Map View</h3>
            <p className={`${textSecondary} mb-4`}>
              Interactive map with event pins coming soon
            </p>
            <p className={`${textTertiary} text-sm`}>
              Will show {filteredEvents.length} events on map
            </p>
          </div>
        )}
      </div>

      {/* Filter Sheet */}
      {showFilterSheet && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 z-[60] animate-fadeIn"
            onClick={() => setShowFilterSheet(false)}
          />
          
          {/* Sheet */}
          <div
            ref={filterSheetRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl z-[70] max-h-[85vh] overflow-hidden animate-slideUp"
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-gray-700 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-800">
              <h2 className="text-white font-bold text-xl">Filters</h2>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-6 space-y-6">
              {/* Location */}
              <div>
                <h3 className="text-white font-semibold mb-3">Location</h3>
                <div className="space-y-2">
                  {['2.5km', '5km', '10km', '25km', 'Anywhere'].map((distance) => (
                    <button
                      key={distance}
                      onClick={() => setFilters(prev => ({ ...prev, location: distance }))}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                        filters.location === distance
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Within {distance}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-white font-semibold mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Min: £{filters.priceMin}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.priceMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMin: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Max: £{filters.priceMax}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.priceMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMax: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <h3 className="text-white font-semibold mb-3">Date</h3>
                <div className="space-y-2">
                  {['any', 'today', 'tomorrow', 'this-week', 'this-weekend'].map((date) => (
                    <button
                      key={date}
                      onClick={() => setFilters(prev => ({ ...prev, date }))}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-colors capitalize ${
                        filters.date === date
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {date === 'any' ? 'Any date' : date.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-white font-semibold mb-3">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = filters.categories.includes(category.id);
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-6 border-t border-gray-800">
              <button
                onClick={applyFilters}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
        <div className={`fixed bottom-0 left-0 right-0 ${bgCard} border-t ${border} z-50`}>
        <div className="flex items-center justify-around py-3">
            <Link href="/mobile">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
                <Home className={`w-6 h-6 ${textSecondary}`} />
                <span className={`${textSecondary} text-xs`}>Home</span>
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
                <Search className="w-6 h-6 text-purple-500" />
                <span className="text-purple-500 text-xs font-semibold">Search</span>
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}