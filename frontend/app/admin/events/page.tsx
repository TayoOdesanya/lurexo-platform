'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Calendar,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  MapPin,
  ExternalLink,
  Eye,
  CheckCircle,
  XCircle,
  Radio,
} from 'lucide-react';
import EventStatusBadge from '../../components/admin/EventStatusBadge';
import { mockAllEvents } from '../../../lib/mockData/adminStats';

type StatusFilter = 'all' | 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'live' | 'ended';
type SortBy = 'date' | 'created' | 'revenue' | 'tickets';

export default function AllEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // Filter and sort events
  let filteredEvents = mockAllEvents.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || event.approvalStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort events
  filteredEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'created':
        return new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime();
      case 'revenue':
        return b.revenue - a.revenue;
      case 'tickets':
        return b.ticketsSold - a.ticketsSold;
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalEvents = mockAllEvents.length;
  const pendingCount = mockAllEvents.filter(e => e.approvalStatus === 'pending_approval').length;
  const liveCount = mockAllEvents.filter(e => e.approvalStatus === 'live').length;
  const totalRevenue = mockAllEvents.reduce((sum, e) => sum + e.revenue, 0);
  const totalTickets = mockAllEvents.reduce((sum, e) => sum + e.ticketsSold, 0);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <Radio className="w-4 h-4 text-indigo-400" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'pending_approval':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'ended':
        return <CheckCircle className="w-4 h-4 text-slate-400" />;
      default:
        return <Calendar className="w-4 h-4 text-slate-400" />;
    }
  };

  const getQuickActionLink = (event: typeof mockAllEvents[0]) => {
    if (event.approvalStatus === 'pending_approval') {
      return `/admin/events/${event.id}`;
    }
    return `/admin/events/${event.id}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          All Events
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Comprehensive overview of all events on the platform
        </p>
      </div>

      {/* Stats Dashboard - Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalEvents}</p>
          <p className="text-xs text-slate-400 mt-1">Events</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-indigo-400" />
            <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide">Live</p>
          </div>
          <p className="text-2xl font-bold text-white">{liveCount}</p>
          <p className="text-xs text-slate-400 mt-1">Active now</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-amber-400 font-medium uppercase tracking-wide">Pending</p>
          </div>
          <p className="text-2xl font-bold text-white">{pendingCount}</p>
          <p className="text-xs text-slate-400 mt-1">Need review</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">Revenue</p>
          </div>
          <p className="text-2xl font-bold text-white">£{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{totalTickets.toLocaleString()} tickets</p>
        </div>
      </div>

      {/* Quick Filters - Compact Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'all'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          All ({totalEvents})
        </button>
        <button
          onClick={() => setStatusFilter('pending_approval')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'pending_approval'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter('live')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'live'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Live ({liveCount})
        </button>
        <button
          onClick={() => setStatusFilter('ended')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'ended'
              ? 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-400 border border-slate-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Ended
        </button>
      </div>

      {/* Search & Sort - Single Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, organizers, or venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
        >
          <option value="date">Sort by Date</option>
          <option value="created">Sort by Created</option>
          <option value="revenue">Sort by Revenue</option>
          <option value="tickets">Sort by Tickets</option>
        </select>
      </div>

      {/* Results Count */}
      {(searchQuery || statusFilter !== 'all') && (
        <p className="text-sm text-slate-400">
          Showing {filteredEvents.length} of {totalEvents} events
        </p>
      )}

      {/* Events Table - Desktop */}
      <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No events found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Organizer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Date & Venue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Tickets
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(event.approvalStatus)}
                        <div>
                          <p className="font-semibold text-white line-clamp-1">
                            {event.title}
                          </p>
                          {event.flaggedReasons && event.flaggedReasons.length > 0 && (
                            <p className="text-xs text-rose-400 mt-0.5">
                              🚩 {event.flaggedReasons.length} flag{event.flaggedReasons.length > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-white">{event.organizerName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-white font-medium">{formatDate(event.date)}</p>
                        <p className="text-slate-400 text-xs truncate max-w-[150px]">{event.venue}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <EventStatusBadge status={event.approvalStatus} size="sm" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-semibold text-white">
                        {event.ticketsSold.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-bold text-emerald-400">
                        £{event.revenue.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Link
                        href={getQuickActionLink(event)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-lg text-xs font-medium transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Events Cards - Mobile */}
      <div className="lg:hidden space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-12 border border-slate-700/50 text-center">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No events found</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Link
              key={event.id}
              href={getQuickActionLink(event)}
              className="block group"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400">by {event.organizerName}</p>
                  </div>
                  <EventStatusBadge status={event.approvalStatus} size="sm" />
                </div>

                {/* Flags */}
                {event.flaggedReasons && event.flaggedReasons.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {event.flaggedReasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 rounded text-xs text-rose-400"
                      >
                        🚩 {reason.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-xs font-medium text-white">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <div>
                      <p className="text-xs text-slate-500">Venue</p>
                      <p className="text-xs font-medium text-white truncate">{event.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <div>
                      <p className="text-xs text-slate-500">Tickets</p>
                      <p className="text-xs font-medium text-white">{event.ticketsSold.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs text-slate-500">Revenue</p>
                      <p className="text-xs font-medium text-emerald-400">£{event.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}