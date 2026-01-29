'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Eye,
  Radio,
  TrendingUp,
  Clock,
  ExternalLink,
} from 'lucide-react';
import EventStatusBadge from '../../../components/admin/EventStatusBadge';
import { mockLiveEvents } from '../../../../lib/mockData/adminStats';

type SortBy = 'date' | 'revenue' | 'tickets';

export default function LiveEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // Filter and sort events
  let filteredEvents = mockLiveEvents.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Sort events
  filteredEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'revenue':
        return b.revenue - a.revenue;
      case 'tickets':
        return b.ticketsSold - a.ticketsSold;
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalRevenue = mockLiveEvents.reduce((sum, e) => sum + e.revenue, 0);
  const totalTickets = mockLiveEvents.reduce((sum, e) => sum + e.ticketsSold, 0);
  const avgTicketsPerEvent = mockLiveEvents.length > 0 ? Math.round(totalTickets / mockLiveEvents.length) : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTimeUntilEvent = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    const days = Math.floor(diff / 86400000);
    
    if (days < 0) return 'Today';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return `In ${days} days`;
    if (days < 30) return `In ${Math.floor(days / 7)} weeks`;
    return `In ${Math.floor(days / 30)} months`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Radio className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Live Events
            </h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base">
            Currently active and accepting ticket sales
          </p>
        </div>
        <Link
          href="/admin/events"
          className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-white text-sm font-medium transition-all"
        >
          All Events
        </Link>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-5 border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Radio className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Live Events</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{mockLiveEvents.length}</p>
          <p className="text-xs text-slate-400 mt-2">Active now</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-5 border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Revenue</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">£{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">Total sales</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-5 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Tickets Sold</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{totalTickets.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">Across all events</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Avg per Event</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{avgTicketsPerEvent}</p>
          <p className="text-xs text-slate-400 mt-2">Tickets sold</p>
        </div>
      </div>

      {/* Live Status Banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {mockLiveEvents.length} event{mockLiveEvents.length !== 1 ? 's are' : ' is'} currently live and accepting bookings
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Real-time ticket sales being processed
            </p>
          </div>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search live events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
        >
          <option value="date">Sort by Date</option>
          <option value="revenue">Sort by Revenue</option>
          <option value="tickets">Sort by Tickets</option>
        </select>
      </div>

      {/* Events Table - Desktop */}
      <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Radio className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No live events found</p>
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
                    Time Until
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Tickets Sold
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
                        <div className="relative">
                          <Radio className="w-4 h-4 text-indigo-400" />
                          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                        </div>
                        <p className="font-semibold text-white line-clamp-1">
                          {event.title}
                        </p>
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-medium text-amber-400">
                        <Clock className="w-3 h-3" />
                        {getTimeUntilEvent(event.date)}
                      </span>
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
                        href={`/admin/events/${event.id}`}
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
            <Radio className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No live events found</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Link
              key={event.id}
              href={`/admin/events/${event.id}`}
              className="block group"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 relative overflow-hidden">
                
                {/* Live Indicator */}
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
                  </div>
                </div>

                {/* Content */}
                <div className="pr-8">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 mb-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">by {event.organizerName}</p>

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
                      <Clock className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-slate-500">Time</p>
                        <p className="text-xs font-medium text-amber-400">{getTimeUntilEvent(event.date)}</p>
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

                  {/* Venue */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <p className="text-xs text-slate-400 truncate">{event.venue}</p>
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