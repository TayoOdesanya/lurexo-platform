'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, AlertTriangle, Calendar, MapPin, User, Clock, Filter } from 'lucide-react';
import EventStatusBadge from '../../../components/admin/EventStatusBadge';
import { mockPendingEvents } from '../../../../lib/mockData/adminStats';

export default function PendingEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFlags, setFilterFlags] = useState<'all' | 'flagged' | 'clean'>('all');

  // Filter events based on search and flags
  const filteredEvents = mockPendingEvents.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      filterFlags === 'all' ||
      (filterFlags === 'flagged' && event.flaggedReasons && event.flaggedReasons.length > 0) ||
      (filterFlags === 'clean' && (!event.flaggedReasons || event.flaggedReasons.length === 0));

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const flaggedCount = mockPendingEvents.filter(e => e.flaggedReasons && e.flaggedReasons.length > 0).length;
  const cleanCount = mockPendingEvents.filter(e => !e.flaggedReasons || e.flaggedReasons.length === 0).length;

  return (
    <div className="space-y-6">
      {/* Header - Compact on Mobile */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Pending Events
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          {mockPendingEvents.length} event{mockPendingEvents.length !== 1 ? 's' : ''} awaiting review
        </p>
      </div>

      {/* Filter Chips - Mobile Optimized */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterFlags('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            filterFlags === 'all'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          All ({mockPendingEvents.length})
        </button>
        <button
          onClick={() => setFilterFlags('flagged')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            filterFlags === 'flagged'
              ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Flagged ({flaggedCount})
          </span>
        </button>
        <button
          onClick={() => setFilterFlags('clean')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            filterFlags === 'clean'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Clean ({cleanCount})
        </button>
      </div>

      {/* Search Bar - Mobile Optimized */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm sm:text-base placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      {/* Events List - Compact Cards */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 sm:p-12 border border-slate-700/50 text-center">
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No events found</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Link
              key={event.id}
              href={`/admin/events/${event.id}`}
              className="block group"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 sm:p-5 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10">
                
                {/* Title Row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      by {event.organizerName}
                    </p>
                  </div>
                  
                  {/* Flags - Mobile: Small badge, Desktop: Full info */}
                  {event.flaggedReasons && event.flaggedReasons.length > 0 && (
                    <div className="flex-shrink-0">
                      <div className="sm:hidden flex items-center justify-center w-6 h-6 bg-rose-500/20 border border-rose-500/40 rounded-lg">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-xs font-semibold text-rose-400">
                          {event.flaggedReasons.length} flag{event.flaggedReasons.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Grid - Compact */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-xs sm:text-sm font-medium text-white truncate">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Venue</p>
                      <p className="text-xs sm:text-sm font-medium text-white truncate">
                        {event.venue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 min-w-0 col-span-2 sm:col-span-1">
                    <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Submitted</p>
                      <p className="text-xs sm:text-sm font-medium text-white">
                        {event.submittedAt ? getTimeAgo(event.submittedAt) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flagged Reasons - Only on flagged events */}
                {event.flaggedReasons && event.flaggedReasons.length > 0 && (
                  <div className="pt-3 border-t border-slate-700/30">
                    <div className="flex flex-wrap gap-1.5">
                      {event.flaggedReasons.map((reason, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded text-xs font-medium text-rose-400"
                        >
                          {reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Hint - Desktop Only */}
                <div className="hidden sm:block mt-3 pt-3 border-t border-slate-700/30">
                  <p className="text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    Review event
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}