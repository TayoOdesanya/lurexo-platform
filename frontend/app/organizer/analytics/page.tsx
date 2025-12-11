'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ticket,
  Users,
  Eye,
  MapPin,
  Calendar,
  Clock,
  Share2,
  Download,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  Heart,
  ShoppingCart,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedEvent, setSelectedEvent] = useState('all');

  // Mock data
  const overviewStats = {
    totalRevenue: 287450,
    revenueChange: 12.5,
    ticketsSold: 8427,
    ticketsChange: 8.3,
    totalViews: 124532,
    viewsChange: -3.2,
    conversionRate: 6.8,
    conversionChange: 2.1,
    activeEvents: 12,
    avgTicketPrice: 34.11
  };

  // Sales over time
  const salesData = [
    { date: 'Nov 1', revenue: 4200, tickets: 89, views: 2340 },
    { date: 'Nov 3', revenue: 5800, tickets: 124, views: 3120 },
    { date: 'Nov 5', revenue: 3900, tickets: 76, views: 2890 },
    { date: 'Nov 7', revenue: 6200, tickets: 142, views: 3540 },
    { date: 'Nov 9', revenue: 7100, tickets: 156, views: 3890 },
    { date: 'Nov 11', revenue: 8500, tickets: 187, views: 4230 },
    { date: 'Nov 13', revenue: 6800, tickets: 145, views: 3670 },
    { date: 'Nov 15', revenue: 9200, tickets: 203, views: 4560 },
    { date: 'Nov 17', revenue: 11400, tickets: 247, views: 5120 },
    { date: 'Nov 19', revenue: 8900, tickets: 189, views: 4340 },
    { date: 'Nov 21', revenue: 10200, tickets: 221, views: 4780 },
    { date: 'Nov 23', revenue: 12100, tickets: 267, views: 5340 },
    { date: 'Nov 25', revenue: 9800, tickets: 198, views: 4560 },
    { date: 'Nov 27', revenue: 8300, tickets: 176, views: 4120 }
  ];

  // Ticket types breakdown
  const ticketTypesData = [
    { name: 'General Admission', value: 4523, revenue: 135690, color: '#8b5cf6' },
    { name: 'VIP', value: 1247, revenue: 87290, color: '#3b82f6' },
    { name: 'Early Bird', value: 2124, revenue: 53100, color: '#10b981' },
    { name: 'Group', value: 533, revenue: 11370, color: '#f59e0b' }
  ];

  // Geographic data
  const geographicData = [
    { location: 'London', tickets: 3421, percentage: 40.6 },
    { location: 'Manchester', tickets: 1264, percentage: 15.0 },
    { location: 'Birmingham', tickets: 987, percentage: 11.7 },
    { location: 'Edinburgh', tickets: 743, percentage: 8.8 },
    { location: 'Glasgow', tickets: 621, percentage: 7.4 },
    { location: 'Other', tickets: 1391, percentage: 16.5 }
  ];

  // Device breakdown
  const deviceData = [
    { name: 'Mobile', value: 58.3, color: '#8b5cf6' },
    { name: 'Desktop', value: 33.2, color: '#3b82f6' },
    { name: 'Tablet', value: 8.5, color: '#10b981' }
  ];

  // Traffic sources
  const trafficSourcesData = [
    { source: 'Direct', visits: 34521, tickets: 2341, conversion: 6.8 },
    { source: 'Social Media', visits: 28934, tickets: 2124, conversion: 7.3 },
    { source: 'Email', visits: 15234, tickets: 1456, conversion: 9.6 },
    { source: 'Search', visits: 12453, tickets: 892, conversion: 7.2 },
    { source: 'Referral', visits: 8234, tickets: 614, conversion: 7.5 }
  ];

  // Peak hours
  const peakHoursData = [
    { hour: '00:00', sales: 12 },
    { hour: '03:00', sales: 8 },
    { hour: '06:00', sales: 15 },
    { hour: '09:00', sales: 89 },
    { hour: '12:00', sales: 156 },
    { hour: '15:00', sales: 134 },
    { hour: '18:00', sales: 234 },
    { hour: '21:00', sales: 198 }
  ];

  // Top events
  const topEvents = [
    { name: 'Summer Music Festival', tickets: 847, revenue: 42350, trend: 'up' },
    { name: 'Jazz Night Live', tickets: 124, revenue: 6200, trend: 'up' },
    { name: 'Tech Conference 2025', tickets: 500, revenue: 45000, trend: 'down' },
    { name: 'Food & Wine Festival', tickets: 234, revenue: 11700, trend: 'up' }
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">
                Analytics Overview
              </h1>
              <p className="text-gray-400 text-sm">
                Track your performance and insights
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters */}
        <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date range selector */}
            <div className="flex-1">
              <label className="text-gray-400 text-xs font-medium mb-2 block">
                Time Period
              </label>
              <div className="flex gap-2">
                {['7days', '30days', '90days', 'all'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {period === 'all' ? 'All Time' : period.replace('days', ' Days')}
                  </button>
                ))}
              </div>
            </div>

            {/* Event selector */}
            <div className="flex-1">
              <label className="text-gray-400 text-xs font-medium mb-2 block">
                Filter by Event
              </label>
              <div className="relative">
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer"
                >
                  <option value="all">All Events</option>
                  <option value="1">Summer Music Festival</option>
                  <option value="2">Jazz Night Live</option>
                  <option value="3">Tech Conference 2025</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                overviewStats.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {overviewStats.revenueChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(overviewStats.revenueChange)}%
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <p className="text-white font-bold text-3xl">
              £{overviewStats.totalRevenue.toLocaleString()}
            </p>
          </div>

          {/* Tickets Sold */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-blue-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                overviewStats.ticketsChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {overviewStats.ticketsChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(overviewStats.ticketsChange)}%
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Tickets Sold</p>
            <p className="text-white font-bold text-3xl">
              {overviewStats.ticketsSold.toLocaleString()}
            </p>
          </div>

          {/* Total Views */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                overviewStats.viewsChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {overviewStats.viewsChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(overviewStats.viewsChange)}%
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Views</p>
            <p className="text-white font-bold text-3xl">
              {overviewStats.totalViews.toLocaleString()}
            </p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                overviewStats.conversionChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {overviewStats.conversionChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(overviewStats.conversionChange)}%
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Conversion Rate</p>
            <p className="text-white font-bold text-3xl">
              {overviewStats.conversionRate}%
            </p>
          </div>
        </div>

        {/* Revenue & Tickets Chart */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold text-xl mb-1">Sales Performance</h2>
              <p className="text-gray-400 text-sm">Revenue and ticket sales over time</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span className="text-gray-400 text-sm">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-gray-400 text-sm">Tickets</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  name="Revenue (£)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="tickets"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorTickets)"
                  name="Tickets"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Ticket Types Breakdown */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white font-bold text-xl mb-6">Ticket Types</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ticketTypesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {ticketTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3">
              {ticketTypesData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-400 text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{item.value} tickets</p>
                    <p className="text-gray-500 text-xs">£{item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white font-bold text-xl mb-6">Device Usage</h2>
            <div className="space-y-4">
              {deviceData.map((device, index) => {
                const Icon = device.name === 'Mobile' ? Smartphone : device.name === 'Desktop' ? Monitor : Smartphone;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${device.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: device.color }} />
                        </div>
                        <span className="text-gray-400">{device.name}</span>
                      </div>
                      <span className="text-white font-bold">{device.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${device.value}%`,
                          backgroundColor: device.color
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Peak Hours */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <h3 className="text-white font-bold text-lg mb-4">Peak Sales Hours</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <h2 className="text-white font-bold text-xl mb-6">Geographic Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {geographicData.map((location, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold">{location.location}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{location.percentage}%</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {location.tickets.toLocaleString()} tickets
                </p>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                    style={{ width: `${location.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <h2 className="text-white font-bold text-xl mb-6">Traffic Sources</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium text-sm py-3 px-4">Source</th>
                  <th className="text-right text-gray-400 font-medium text-sm py-3 px-4">Visits</th>
                  <th className="text-right text-gray-400 font-medium text-sm py-3 px-4">Tickets</th>
                  <th className="text-right text-gray-400 font-medium text-sm py-3 px-4">Conversion</th>
                  <th className="text-right text-gray-400 font-medium text-sm py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {trafficSourcesData.map((source, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-white font-medium">{source.source}</span>
                      </div>
                    </td>
                    <td className="text-right text-white py-4 px-4">
                      {source.visits.toLocaleString()}
                    </td>
                    <td className="text-right text-white py-4 px-4">
                      {source.tickets.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className="text-green-400 font-semibold">
                        {source.conversion}%
                      </span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="w-full bg-gray-700 rounded-full h-2 max-w-[100px] ml-auto">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                          style={{ width: `${source.conversion * 10}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-xl">Top Performing Events</h2>
            <Link href="/organizer/manage-events">
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                View All Events
              </button>
            </Link>
          </div>
          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{event.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {event.tickets} tickets • £{event.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  event.trend === 'up'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {event.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}