'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Ticket,
  Users,
  DollarSign,
  Clock,
  MapPin,
  BarChart3,
  Search,
} from 'lucide-react';
import { mockPopularEvents, mockAllEvents } from '../../../../lib/mockData/adminStats';

type TimeRange = '7d' | '30d' | '90d' | '1y';
type CategoryFilter = 'all' | 'music' | 'sports' | 'arts' | 'tech' | 'other';

export default function EventAnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock additional event data
  const eventStats = {
    totalEvents: 342,
    liveEvents: 28,
    upcomingEvents: 156,
    pastEvents: 158,
    avgTicketsPerEvent: 26.2,
    avgRevenuePerEvent: 1425,
    totalTicketsSold: 8947,
    totalRevenue: 487293,
  };

  const categoryBreakdown = [
    { name: 'Music', count: 142, percentage: 41.5, revenue: 245000 },
    { name: 'Sports', count: 89, percentage: 26.0, revenue: 156000 },
    { name: 'Arts', count: 56, percentage: 16.4, revenue: 52000 },
    { name: 'Tech', count: 34, percentage: 9.9, revenue: 28000 },
    { name: 'Other', count: 21, percentage: 6.1, revenue: 6293 },
  ];

  const eventTrends = [
    { month: 'Aug', events: 24, tickets: 612 },
    { month: 'Sep', events: 28, tickets: 734 },
    { month: 'Oct', events: 32, tickets: 856 },
    { month: 'Nov', events: 29, tickets: 782 },
    { month: 'Dec', events: 38, tickets: 1024 },
    { month: 'Jan', events: 42, tickets: 1156 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      live: {
        label: 'Live',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
      },
      upcoming: {
        label: 'Upcoming',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
      },
      ended: {
        label: 'Ended',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        text: 'text-slate-400',
      },
    };
    const config = configs[status as keyof typeof configs] || configs.upcoming;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${config.bg} ${config.border} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/analytics')}
          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Event Analytics
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Detailed event performance and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-4 py-2 bg-slate-800 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              18.7%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Events</p>
          <p className="text-white font-bold text-3xl">{eventStats.totalEvents}</p>
          <p className="text-indigo-400 text-xs mt-2">All time</p>
        </div>

        {/* Live Events */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Live Events</p>
          <p className="text-white font-bold text-3xl">{eventStats.liveEvents}</p>
          <p className="text-emerald-400 text-xs mt-2">Currently active</p>
        </div>

        {/* Avg Tickets/Event */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Ticket className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              12.3%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Avg Tickets/Event</p>
          <p className="text-white font-bold text-3xl">{eventStats.avgTicketsPerEvent}</p>
          <p className="text-blue-400 text-xs mt-2">Per event</p>
        </div>

        {/* Avg Revenue/Event */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              28.5%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Avg Revenue/Event</p>
          <p className="text-white font-bold text-3xl">{formatCurrency(eventStats.avgRevenuePerEvent)}</p>
          <p className="text-purple-400 text-xs mt-2">Per event</p>
        </div>
      </div>

      {/* Event Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Live Events</p>
              <p className="text-white font-bold text-2xl">{eventStats.liveEvents}</p>
            </div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${(eventStats.liveEvents / eventStats.totalEvents) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Upcoming Events</p>
              <p className="text-white font-bold text-2xl">{eventStats.upcomingEvents}</p>
            </div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${(eventStats.upcomingEvents / eventStats.totalEvents) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-500/10 rounded-lg border border-slate-500/30">
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Past Events</p>
              <p className="text-white font-bold text-2xl">{eventStats.pastEvents}</p>
            </div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-slate-500 to-slate-600" style={{ width: `${(eventStats.pastEvents / eventStats.totalEvents) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <h3 className="text-white font-bold text-lg mb-6">Events by Category</h3>
        <div className="space-y-4">
          {categoryBreakdown.map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{category.name}</span>
                  <span className="text-slate-500 text-sm">{category.count} events</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 font-semibold">{formatCurrency(category.revenue)}</span>
                  <span className="text-slate-400 text-sm">{category.percentage}%</span>
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Events */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <h3 className="text-white font-bold text-lg mb-6">Top Performing Events</h3>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Event
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {mockPopularEvents.map((event) => (
                <tr key={event.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-white font-medium">{event.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(new Date(event.date) > new Date() ? 'upcoming' : 'ended')}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-white font-semibold">{event.ticketsSold.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-emerald-400 font-semibold">{formatCurrency(event.revenue)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-slate-300 text-sm">{formatDate(event.date)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {mockPopularEvents.map((event) => (
            <div key={event.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{event.name}</h4>
                  <p className="text-slate-400 text-xs">{formatDate(event.date)}</p>
                </div>
                {getStatusBadge(new Date(event.date) > new Date() ? 'upcoming' : 'ended')}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-500 text-xs">Tickets Sold</p>
                  <p className="text-white font-semibold">{event.ticketsSold.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Revenue</p>
                  <p className="text-emerald-400 font-semibold">{formatCurrency(event.revenue)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}