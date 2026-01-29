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
  Archive,
  TrendingUp,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import EventStatusBadge from '../../../components/admin/EventStatusBadge';
import { mockPastEvents } from '../../../../lib/mockData/adminStats';

type SortBy = 'date' | 'revenue' | 'tickets';

export default function PastEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // Filter and sort events
  let filteredEvents = mockPastEvents.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Sort events (default: most recent first)
  filteredEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime(); // Most recent first
      case 'revenue':
        return b.revenue - a.revenue;
      case 'tickets':
        return b.ticketsSold - a.ticketsSold;
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalRevenue = mockPastEvents.reduce((sum, e) => sum + e.revenue, 0);
  const totalTickets = mockPastEvents.reduce((sum, e) => sum + e.ticketsSold, 0);
  const avgTicketsPerEvent = mockPastEvents.length > 0 ? Math.round(totalTickets / mockPastEvents.length) : 0;
  const avgRevenuePerEvent = mockPastEvents.length > 0 ? Math.round(totalRevenue / mockPastEvents.length) : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - eventDate.getTime();
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-slate-500/10 rounded-lg border border-slate-500/20">
              <Archive className="w-5 h-5 text-slate-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Past Events
            </h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base">
            Archive of completed events and performance history
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
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <Archive className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Total Events</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{mockPastEvents.length}</p>
          <p className="text-xs text-slate-400 mt-2">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-5 border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Total Revenue</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">£{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-2">Historical earnings</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-5 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Total Tickets</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{totalTickets.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">Tickets sold</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Avg Revenue</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">£{avgRevenuePerEvent.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">Per event</p>
        </div>
      </div>

      {/* Archive Info Banner */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-white">
              {mockPastEvents.length} event{mockPastEvents.length !== 1 ? 's' : ''} successfully completed
            </p>
            <p className="text-xs text-slate-400 mt-1">
              £{totalRevenue.toLocaleString()} in total revenue • {totalTickets.toLocaleString()} tickets sold
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
            placeholder="Search past events..."
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
          <option value="date">Sort by Date (Recent)</option>
          <option value="revenue">Sort by Revenue</option>
          <option value="tickets">Sort by Tickets</option>
        </select>
      </div>

      {/* Events Table - Desktop */}
      <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Archive className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No past events found</p>
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
                    Completed
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
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
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
                      <p className="text-sm text-slate-400">{getTimeAgo(event.date)}</p>
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-300 rounded-lg text-xs font-medium transition-all"
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
            <Archive className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No past events found</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Link
              key={event.id}
              href={`/admin/events/${event.id}`}
              className="block group"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-lg">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">Completed</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400">by {event.organizerName}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-xs font-medium text-white">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Completed</p>
                      <p className="text-xs font-medium text-slate-400">{getTimeAgo(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
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
            </Link>
          ))
        )}
      </div>
    </div>
  );
}