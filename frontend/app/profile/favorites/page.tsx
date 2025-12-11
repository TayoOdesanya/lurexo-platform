'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Heart,
  Calendar,
  MapPin,
  Music,
  Star,
  Trash2,
  ExternalLink,
  Filter,
  Grid,
  List,
  Building,
  Users,
  Ticket
} from 'lucide-react';

// Mock favorite events
const MOCK_FAVORITE_EVENTS = [
  {
    id: 'event-1',
    title: 'Summer Music Festival 2025',
    date: '2025-08-15T19:00:00Z',
    venue: 'Hyde Park, London',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    price: 85.00,
    savedDate: '2025-06-01T10:00:00Z'
  },
  {
    id: 'event-5',
    title: 'Jazz Night Live',
    date: '2025-11-20T21:00:00Z',
    venue: 'Ronnie Scott\'s Jazz Club',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
    price: 45.00,
    savedDate: '2025-09-10T15:30:00Z'
  },
  {
    id: 'event-6',
    title: 'Stand-Up Comedy Special',
    date: '2025-12-05T20:00:00Z',
    venue: 'The Comedy Store',
    category: 'Comedy',
    imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    price: 30.00,
    savedDate: '2025-10-01T12:00:00Z'
  }
];

// Mock favorite venues
const MOCK_FAVORITE_VENUES = [
  {
    id: 'venue-1',
    name: 'Hyde Park',
    location: 'London, UK',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    upcomingEvents: 5,
    savedDate: '2024-03-15T10:00:00Z'
  },
  {
    id: 'venue-2',
    name: 'Ronnie Scott\'s Jazz Club',
    location: 'Soho, London',
    imageUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800',
    upcomingEvents: 12,
    savedDate: '2024-05-20T14:30:00Z'
  },
  {
    id: 'venue-3',
    name: 'The Comedy Store',
    location: 'Leicester Square',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
    upcomingEvents: 8,
    savedDate: '2024-06-10T18:00:00Z'
  }
];

// Mock followed organizers
const MOCK_FOLLOWED_ORGANIZERS = [
  {
    id: 'org-1',
    name: 'Live Nation',
    imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=LN&backgroundColor=purple',
    eventsCount: 24,
    followedDate: '2024-02-01T10:00:00Z'
  },
  {
    id: 'org-2',
    name: 'Comedy Central',
    imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=CC&backgroundColor=orange',
    eventsCount: 15,
    followedDate: '2024-04-15T12:00:00Z'
  }
];

export default function FavoriteEventsPage() {
  const [favoriteEvents, setFavoriteEvents] = useState(MOCK_FAVORITE_EVENTS);
  const [favoriteVenues, setFavoriteVenues] = useState(MOCK_FAVORITE_VENUES);
  const [followedOrganizers, setFollowedOrganizers] = useState(MOCK_FOLLOWED_ORGANIZERS);
  const [activeTab, setActiveTab] = useState('events');
  const [viewMode, setViewMode] = useState('grid');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleRemoveEvent = (id) => {
    setFavoriteEvents(prev => prev.filter(event => event.id !== id));
  };

  const handleRemoveVenue = (id) => {
    setFavoriteVenues(prev => prev.filter(venue => venue.id !== id));
  };

  const handleUnfollowOrganizer = (id) => {
    setFollowedOrganizers(prev => prev.filter(org => org.id !== id));
  };

  return (
    <div className="min-h-screen bg-black pb-6">
      {/* MOBILE ONLY: Header */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
            <Link href="/profile">
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-white" />
                </button>
            </Link>
            <div>
                <h1 className="text-white text-xl font-bold">Favorites</h1>
                <p className="text-gray-400 text-xs">
                {favoriteEvents.length} events • {favoriteVenues.length} venues
                </p>
            </div>
            </div>

            {/* View Mode Toggle - Mobile */}
            {activeTab === 'events' && (
            <div className="flex gap-2">
                <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
                >
                <Grid className="w-5 h-5" />
                </button>
                <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
                >
                <List className="w-5 h-5" />
                </button>
            </div>
            )}
        </div>

        {/* Tabs - Mobile */}
        <div className="flex gap-2">
            <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'events'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
            }`}
            >
            <div className="flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Events ({favoriteEvents.length})</span>
            </div>
            </button>
            <button
            onClick={() => setActiveTab('venues')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'venues'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
            }`}
            >
            <div className="flex items-center justify-center gap-2">
                <Building className="w-4 h-4" />
                <span>Venues ({favoriteVenues.length})</span>
            </div>
            </button>
            <button
            onClick={() => setActiveTab('organizers')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'organizers'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
            }`}
            >
            <div className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                <span>Organizers ({followedOrganizers.length})</span>
            </div>
            </button>
        </div>
        </div>

        {/* DESKTOP ONLY: Page header */}
        <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-white text-2xl font-bold">Favorites</h1>
                <p className="text-gray-400 text-sm">
                {favoriteEvents.length} events • {favoriteVenues.length} venues
                </p>
            </div>

            {/* View Mode Toggle - Desktop */}
            {activeTab === 'events' && (
                <div className="flex gap-2">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                    }`}
                >
                    <Grid className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                    }`}
                >
                    <List className="w-5 h-5" />
                </button>
                </div>
            )}
            </div>

            {/* Tabs - Desktop */}
            <div className="flex gap-2">
            <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'events'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
                Events
            </button>
            <button
                onClick={() => setActiveTab('venues')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'venues'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
                Venues
            </button>
            <button
                onClick={() => setActiveTab('organizers')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'organizers'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
                Organizers
            </button>
            </div>
        </div>
        </div>

      <div className="p-4 lg:p-6">
        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            {favoriteEvents.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
                <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No favorite events yet</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Save events you're interested in to see them here
                </p>
                <Link href="/mobile">
                  <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Browse Events
                  </button>
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : 'space-y-3'}>
                {favoriteEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 ${
                      viewMode === 'grid' ? '' : 'flex'
                    }`}
                  >
                    {/* Event Image */}
                    <div className={viewMode === 'grid' ? 'h-48' : 'w-32 h-32'}>
                      <img 
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Event Info */}
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-base mb-1 line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center text-gray-400 text-xs mb-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center text-gray-400 text-xs mb-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.venue}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                              {event.category}
                            </span>
                            <span className="text-white font-bold text-sm">
                              £{event.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveEvent(event.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Link href={`/events/${event.id}`} className="flex-1">
                          <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            View Event
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Venues Tab */}
        {activeTab === 'venues' && (
          <>
            {favoriteVenues.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
                <Building className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No favorite venues yet</h3>
                <p className="text-gray-400 text-sm">
                  Save your favorite venues to get notified about new events
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteVenues.map((venue) => (
                  <div
                    key={venue.id}
                    className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
                  >
                    <div className="flex">
                      {/* Venue Image */}
                      <div className="w-24 h-24">
                        <img 
                          src={venue.imageUrl}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Venue Info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-base mb-1">
                              {venue.name}
                            </h3>
                            <div className="flex items-center text-gray-400 text-xs mb-2">
                              <MapPin className="w-3 h-3 mr-1" />
                              {venue.location}
                            </div>
                            <div className="flex items-center gap-1 text-purple-400 text-xs">
                              <Ticket className="w-3 h-3" />
                              <span>{venue.upcomingEvents} upcoming events</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveVenue(venue.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Organizers Tab */}
        {activeTab === 'organizers' && (
          <>
            {followedOrganizers.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No followed organizers yet</h3>
                <p className="text-gray-400 text-sm">
                  Follow event organizers to stay updated on their events
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {followedOrganizers.map((organizer) => (
                  <div
                    key={organizer.id}
                    className="bg-gray-900 rounded-2xl p-4 border border-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      {/* Organizer Avatar */}
                      <img 
                        src={organizer.imageUrl}
                        alt={organizer.name}
                        className="w-16 h-16 rounded-full"
                      />

                      {/* Organizer Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-base mb-1">
                          {organizer.name}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {organizer.eventsCount} upcoming events
                        </p>
                      </div>

                      {/* Unfollow Button */}
                      <button
                        onClick={() => handleUnfollowOrganizer(organizer.id)}
                        className="px-4 py-2 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg text-sm font-medium transition-colors"
                      >
                        Unfollow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}