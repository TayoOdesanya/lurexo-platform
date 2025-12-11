'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Share2,
  ExternalLink,
  Instagram,
  Twitter,
  Facebook,
  Globe,
  Mail,
  CheckCircle,
  Clock,
  ChevronRight,
  ArrowLeft,
  Heart,
  Sparkles,
  Lock
} from 'lucide-react';
import FollowButton from '@/components/FollowButton';
import ContactModal from '@/components/ContactModal';
import OrganizerEventCard from '@/components/OrganizerEventCard';

// Mock organizer data
const MOCK_ORGANIZER = {
  id: 'org-001',
  username: 'live-nation',
  displayName: 'Live Nation UK',
  tagline: 'Bringing world-class entertainment to fans worldwide',
  bio: 'Live Nation is the world\'s leading live entertainment company, bringing unforgettable concert experiences to millions of fans. From intimate club shows to massive stadium tours, we create moments that last a lifetime. Join our community for early access to tickets and exclusive content.',
  
  // Images
  profileImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
  coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1500',
  
  // Stats
  followerCount: 24847,
  eventsHosted: 127,
  totalAttendees: 842350,
  joinedDate: '2020-01-15',
  
  // Verification
  verified: true,
  verificationDate: '2020-02-01',
  
  // Social Links
  website: 'https://www.livenation.co.uk',
  instagram: 'https://instagram.com/livenationuk',
  twitter: 'https://twitter.com/LiveNationUK',
  facebook: 'https://facebook.com/LiveNationUK',
  
  // Settings
  showFollowerCount: true,
  acceptContactMessages: true,
  
  // Featured Content (visible to followers only)
  followerOnlyContent: {
    message: '🎵 Thanks for following! Get ready for exclusive presale codes and behind-the-scenes content.',
    images: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800'
    ]
  },
  
  // Categories
  categories: ['Music', 'Festival', 'Live Concerts'],
  location: 'London, UK',
  
  // Featured Events (max 3)
  featuredEventIds: ['event-1', 'event-2', 'event-3']
};

// Mock events data
const MOCK_EVENTS = {
  upcoming: [
    {
      id: 'event-1',
      title: 'Summer Music Festival 2025',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      date: '2025-08-15T19:00:00Z',
      venue: 'Hyde Park, London',
      location: 'London, UK',
      category: 'Music',
      price: 85.00,
      ticketsSold: 847,
      totalTickets: 1000,
      isFeatured: true
    },
    {
      id: 'event-2',
      title: 'Jazz Night Under Stars',
      imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
      date: '2025-09-20T20:00:00Z',
      venue: 'Ronnie Scott\'s Jazz Club',
      location: 'London, UK',
      category: 'Music',
      price: 50.00,
      ticketsSold: 124,
      totalTickets: 200,
      isFeatured: true
    },
    {
      id: 'event-3',
      title: 'Rock Festival 2025',
      imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
      date: '2025-10-05T18:00:00Z',
      venue: 'O2 Arena',
      location: 'London, UK',
      category: 'Music',
      price: 65.00,
      ticketsSold: 8924,
      totalTickets: 20000,
      isFeatured: false
    },
    {
      id: 'event-4',
      title: 'Electronic Music Showcase',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
      date: '2025-09-15T21:00:00Z',
      venue: 'Printworks',
      location: 'London, UK',
      category: 'Music',
      price: 55.00,
      ticketsSold: 634,
      totalTickets: 1500,
      isFeatured: false
    }
  ],
  past: [
    {
      id: 'event-5',
      title: 'Wireless Festival 2024',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
      date: '2024-07-10T15:00:00Z',
      venue: 'Finsbury Park',
      location: 'London, UK',
      category: 'Music',
      price: 95.00,
      ticketsSold: 42000,
      totalTickets: 42000,
      isFeatured: false
    },
    {
      id: 'event-6',
      title: 'Reading Festival 2024',
      imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
      date: '2024-08-25T12:00:00Z',
      venue: 'Richfield Avenue',
      location: 'Reading, UK',
      category: 'Music',
      price: 110.00,
      ticketsSold: 87000,
      totalTickets: 87000,
      isFeatured: false
    }
  ]
};

export default function OrganizerProfilePage() {
  const router = useRouter();
  const [organizer, setOrganizer] = useState(MOCK_ORGANIZER);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);

    // Check if user is following (from localStorage or API)
    const followingOrganizers = JSON.parse(localStorage.getItem('following_organizers') || '[]');
    setIsFollowing(followingOrganizers.includes(organizer.id));
  }, [organizer.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${organizer.displayName} on Lurexo!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: organizer.displayName, text, url });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const featuredEvents = events.upcoming.filter(e => e.isFeatured);
  const regularUpcomingEvents = events.upcoming.filter(e => !e.isFeatured);
  const visibleUpcomingEvents = showAllUpcoming ? regularUpcomingEvents : regularUpcomingEvents.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-12 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-gray-900 border-b border-gray-800 sticky top-0 z-40 backdrop-blur-lg bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/events" className="text-gray-400 hover:text-white transition-colors">
                Events
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-white">Organizer</span>
            </div>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-white font-bold text-xl">Lurexo</span>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Share</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Cover Image with Profile Overlay */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-[200px] sm:h-[280px] lg:h-[320px] overflow-hidden relative">
          <img 
            src={organizer.coverImage} 
            alt={`${organizer.displayName} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Profile Picture Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative pb-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full border-4 border-black bg-gray-900 overflow-hidden">
                <img 
                  src={organizer.profileImage} 
                  alt={organizer.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 lg:mt-6">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          {/* Name and Verification */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">
                  {organizer.displayName}
                </h1>
                {organizer.verified && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-xs font-semibold">Verified</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-400 text-sm sm:text-base mb-3">
                {organizer.tagline}
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-3">
                {organizer.categories.map((category, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>

              {/* Location & Joined */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {organizer.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{organizer.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(organizer.joinedDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-6">
            {organizer.showFollowerCount && (
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl">{organizer.followerCount.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">Followers</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{organizer.eventsHosted}</p>
                  <p className="text-gray-400 text-xs">Events Hosted</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{organizer.totalAttendees.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">Total Attendees</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row - Mobile */}
          <div className="lg:hidden grid grid-cols-3 gap-3 mb-6">
            {organizer.showFollowerCount && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <p className="text-white font-bold text-lg">{(organizer.followerCount / 1000).toFixed(1)}K</p>
                <p className="text-gray-400 text-xs">Followers</p>
              </div>
            )}
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
              <p className="text-white font-bold text-lg">{organizer.eventsHosted}</p>
              <p className="text-gray-400 text-xs">Events</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
              <p className="text-white font-bold text-lg">{(organizer.totalAttendees / 1000).toFixed(0)}K</p>
              <p className="text-gray-400 text-xs">Attendees</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <FollowButton 
                organizerId={organizer.id}
                organizerName={organizer.displayName}
                isFollowing={isFollowing}
                onFollowChange={setIsFollowing}
              />
            </div>
            
            {organizer.acceptContactMessages && (
              <button
                onClick={() => setShowContactModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="hidden sm:inline">Contact</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors lg:hidden"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Bio */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-3">About</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {organizer.bio}
            </p>
          </div>

          {/* Social Links */}
          {(organizer.website || organizer.instagram || organizer.twitter || organizer.facebook) && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 mb-6">
              <h2 className="text-white font-bold text-lg mb-4">Connect</h2>
              <div className="flex flex-wrap gap-3">
                {organizer.website && (
                  <a
                    href={organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm">Website</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                )}
                {organizer.instagram && (
                  <a
                    href={organizer.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span className="text-white text-sm">Instagram</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                )}
                {organizer.twitter && (
                  <a
                    href={organizer.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm">Twitter</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                )}
                {organizer.facebook && (
                  <a
                    href={organizer.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-blue-500" />
                    <span className="text-white text-sm">Facebook</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Follower-Only Content */}
        {isFollowing && organizer.followerOnlyContent && (
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-white font-bold text-lg">Exclusive Content for Followers</h2>
            </div>
            
            {organizer.followerOnlyContent.message && (
              <p className="text-purple-200 mb-4">{organizer.followerOnlyContent.message}</p>
            )}

            {organizer.followerOnlyContent.images && organizer.followerOnlyContent.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {organizer.followerOnlyContent.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Exclusive content ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Not Following - Locked Content Teaser */}
        {!isFollowing && organizer.followerOnlyContent && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Unlock Exclusive Content</h3>
              <p className="text-gray-400 text-sm mb-4">
                Follow {organizer.displayName} to access exclusive behind-the-scenes content and early ticket access
              </p>
              <FollowButton 
                organizerId={organizer.id}
                organizerName={organizer.displayName}
                isFollowing={isFollowing}
                onFollowChange={setIsFollowing}
              />
            </div>
          </div>
        )}

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-xl sm:text-2xl">Featured Events</h2>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredEvents.map((event) => (
                <OrganizerEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="mb-8">
          <h2 className="text-white font-bold text-xl sm:text-2xl mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {visibleUpcomingEvents.map((event) => (
              <OrganizerEventCard key={event.id} event={event} layout="horizontal" />
            ))}
          </div>

          {regularUpcomingEvents.length > 3 && (
            <button
              onClick={() => setShowAllUpcoming(!showAllUpcoming)}
              className="w-full mt-4 py-3 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl text-gray-400 hover:text-purple-400 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>{showAllUpcoming ? 'Show Less' : `View All ${regularUpcomingEvents.length} Events`}</span>
              <ChevronRight className={`w-5 h-5 transition-transform ${showAllUpcoming ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {/* Past Events */}
        {events.past.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setShowPastEvents(!showPastEvents)}
              className="flex items-center justify-between w-full mb-4"
            >
              <h2 className="text-white font-bold text-xl sm:text-2xl">Past Events</h2>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showPastEvents ? 'rotate-90' : ''}`} />
            </button>

            {showPastEvents && (
              <div className="space-y-4">
                {events.past.map((event) => (
                  <OrganizerEventCard key={event.id} event={event} layout="horizontal" isPast />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          organizer={organizer}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Mobile Sticky Follow Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-30">
        <FollowButton 
          organizerId={organizer.id}
          organizerName={organizer.displayName}
          isFollowing={isFollowing}
          onFollowChange={setIsFollowing}
          fullWidth
        />
      </div>
    </div>
  );
}