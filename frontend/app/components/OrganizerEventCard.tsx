'use client';

import Link from 'next/link';
import { Calendar, MapPin, Clock, TrendingUp, CheckCircle } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  venue: string;
  location: string;
  category: string;
  price: number;
  ticketsSold?: number;
  totalTickets?: number;
  isFeatured?: boolean;
}

interface OrganizerEventCardProps {
  event: Event;
  layout?: 'grid' | 'horizontal';
  isPast?: boolean;
}

export default function OrganizerEventCard({ 
  event, 
  layout = 'grid',
  isPast = false 
}: OrganizerEventCardProps) {
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

  const percentSold = event.ticketsSold && event.totalTickets 
    ? (event.ticketsSold / event.totalTickets) * 100 
    : 0;

  // Grid Layout (for featured events)
  if (layout === 'grid') {
    return (
      <Link href={`/events/${event.id}`}>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-all group cursor-pointer">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">
                {event.category}
              </span>
            </div>

            {/* Featured Badge */}
            {event.isFeatured && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Featured
                </span>
              </div>
            )}

            {/* Past Event Badge */}
            {isPast && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-gray-800 border border-gray-700 text-gray-400 rounded-full text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Past Event
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
              {event.title}
            </h3>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{formatDate(event.date)}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{formatTime(event.date)}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
            </div>

            {/* Price & Availability */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">From</p>
                <p className="text-white font-bold text-lg">£{event.price.toFixed(2)}</p>
              </div>

              {event.ticketsSold && event.totalTickets && !isPast && (
                <div className="text-right">
                  <p className="text-gray-400 text-xs mb-0.5">
                    {percentSold >= 75 ? 'Selling Fast' : 'Available'}
                  </p>
                  <p className={`text-sm font-semibold ${
                    percentSold >= 75 ? 'text-orange-400' : 'text-green-400'
                  }`}>
                    {Math.round(percentSold)}% sold
                  </p>
                </div>
              )}

              {isPast && (
                <div className="text-right">
                  <p className="text-gray-400 text-xs mb-0.5">Total Attendees</p>
                  <p className="text-gray-300 text-sm font-semibold">
                    {event.ticketsSold?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Horizontal Layout (for event lists)
  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-all group cursor-pointer">
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {isPast && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-white font-bold text-base sm:text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
                {event.title}
              </h3>
              
              {/* Featured Badge - Desktop */}
              {event.isFeatured && !isPast && (
                <span className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-xs font-semibold flex-shrink-0">
                  <TrendingUp className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{formatDate(event.date)} • {formatTime(event.date)}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">From</p>
                <p className="text-white font-bold text-base sm:text-lg">£{event.price.toFixed(2)}</p>
              </div>

              {event.ticketsSold && event.totalTickets && !isPast && (
                <div className="text-right">
                  <p className="text-gray-400 text-xs mb-0.5">Availability</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          percentSold >= 75 ? 'bg-orange-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                    <p className={`text-sm font-semibold ${
                      percentSold >= 75 ? 'text-orange-400' : 'text-green-400'
                    }`}>
                      {Math.round(percentSold)}%
                    </p>
                  </div>
                </div>
              )}

              {isPast && (
                <div className="text-right">
                  <p className="text-gray-400 text-xs mb-0.5">Attendees</p>
                  <p className="text-gray-300 text-sm font-semibold">
                    {event.ticketsSold?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}