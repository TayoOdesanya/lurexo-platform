'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Ticket,
  ArrowUpRight,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import {
  mockPlatformStats,
  mockRevenueData,
  mockEventCreationData,
  mockUserGrowthData,
  mockPopularEvents,
  mockPopularOrganizers,
} from '../../../lib/mockData/adminStats';

type TimeRange = '7d' | '30d' | '90d' | '1y';

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const stats = mockPlatformStats;
  const topEvents = mockPopularEvents.slice(0, 5);
  const topOrganizers = mockPopularOrganizers.slice(0, 5);

  // Calculate growth percentages
  const revenueGrowth = 28.5;
  const userGrowth = 12.3;
  const eventGrowth = 18.7;
  const ticketGrowth = 32.4;

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
    });
  };

  const getTimeRangeLabel = (range: TimeRange) => {
    const labels = {
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 90 days',
      '1y': 'Last year',
    };
    return labels[range];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Platform performance and insights
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
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${revenueGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {revenueGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(revenueGrowth)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Revenue</p>
          <p className="text-white font-bold text-3xl">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-emerald-400 text-xs mt-2">{getTimeRangeLabel(timeRange)}</p>
        </div>

        {/* Total Users */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${userGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {userGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(userGrowth)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Users</p>
          <p className="text-white font-bold text-3xl">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-indigo-400 text-xs mt-2">+{stats.changeVsPrevious.users}% vs previous</p>
        </div>

        {/* Total Events */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${eventGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {eventGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(eventGrowth)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Events</p>
          <p className="text-white font-bold text-3xl">342</p>
          <p className="text-blue-400 text-xs mt-2">{getTimeRangeLabel(timeRange)}</p>
        </div>

        {/* Tickets Sold */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Ticket className="w-6 h-6 text-purple-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${ticketGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {ticketGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(ticketGrowth)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Tickets Sold</p>
          <p className="text-white font-bold text-3xl">8,947</p>
          <p className="text-purple-400 text-xs mt-2">{getTimeRangeLabel(timeRange)}</p>
        </div>
      </div>

      {/* Quick Links to Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Analytics Link */}
        <Link
          href="/admin/analytics/events"
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Event Analytics</h3>
                <p className="text-slate-400 text-sm">Performance metrics and trends</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-1">Total Events</p>
              <p className="text-white font-semibold">342</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-1">Live Now</p>
              <p className="text-white font-semibold">28</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-1">Upcoming</p>
              <p className="text-white font-semibold">156</p>
            </div>
          </div>
        </Link>

        {/* Revenue Analytics Link */}
        <Link
          href="/admin/analytics/revenue"
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6 hover:border-emerald-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                <PieChart className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Revenue Analytics</h3>
                <p className="text-slate-400 text-sm">Financial insights and breakdown</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-1">Revenue</p>
              <p className="text-white font-semibold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-1">Avg/Event</p>
              <p className="text-white font-semibold">{formatCurrency(1425)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-1">Growth</p>
              <p className="text-emerald-400 font-semibold">+{revenueGrowth}%</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Top Performing Events */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h3 className="text-white font-bold text-lg">Top Performing Events</h3>
          </div>
          <Link
            href="/admin/analytics/events"
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Event
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Tickets Sold
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
              {topEvents.map((event, index) => (
                <tr key={event.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                      <span className="text-indigo-400 font-bold text-sm">#{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white font-medium">{event.name}</p>
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
          {topEvents.map((event, index) => (
            <div key={event.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex-shrink-0">
                  <span className="text-indigo-400 font-bold text-sm">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold mb-1">{event.name}</h4>
                  <p className="text-slate-400 text-xs">{formatDate(event.date)}</p>
                </div>
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

      {/* Top Organizers */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-bold text-lg">Top Organizers</h3>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Organizer
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Events
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {topOrganizers.map((organizer, index) => (
                <tr key={organizer.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30">
                      <span className="text-purple-400 font-bold text-sm">#{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white font-medium">{organizer.name}</p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-white font-semibold">{organizer.eventsCount}</p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-emerald-400 font-semibold">{formatCurrency(organizer.revenue)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {topOrganizers.map((organizer, index) => (
            <div key={organizer.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex-shrink-0">
                  <span className="text-purple-400 font-bold text-sm">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold">{organizer.name}</h4>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-500 text-xs">Events</p>
                  <p className="text-white font-semibold">{organizer.eventsCount}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Revenue</p>
                  <p className="text-emerald-400 font-semibold">{formatCurrency(organizer.revenue)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}