'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ticket,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Mail,
  Share2,
  Eye,
  Edit,
  MoreVertical,
  Zap,
  Target,
  RefreshCw,
  Shield,
  Sparkles,
  Activity,
  CreditCard,
  ChevronRight,
  Plus,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function OrganizerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  // Mock data
  const organizerName = 'Alex Morgan';
  const totalEvents = 12;
  const ticketsSold = 8427;
  const totalRevenue = 287450;
  const availablePayout = 24780;

  // Revenue chart data (last 30 days)
  const revenueData = [
    { date: 'Nov 1', revenue: 4200, tickets: 89 },
    { date: 'Nov 3', revenue: 5800, tickets: 124 },
    { date: 'Nov 5', revenue: 3900, tickets: 76 },
    { date: 'Nov 7', revenue: 6200, tickets: 142 },
    { date: 'Nov 9', revenue: 7100, tickets: 156 },
    { date: 'Nov 11', revenue: 8500, tickets: 187 },
    { date: 'Nov 13', revenue: 6800, tickets: 145 },
    { date: 'Nov 15', revenue: 9200, tickets: 203 },
    { date: 'Nov 17', revenue: 11400, tickets: 247 },
    { date: 'Nov 19', revenue: 8900, tickets: 189 },
    { date: 'Nov 21', revenue: 10200, tickets: 221 },
    { date: 'Nov 23', revenue: 12100, tickets: 267 },
    { date: 'Nov 25', revenue: 9800, tickets: 198 },
    { date: 'Nov 27', revenue: 8300, tickets: 176 }
  ];

  // Fan relationship data
  const fanHealthData = [
    { month: 'Jun', retention: 45, engagement: 62 },
    { month: 'Jul', retention: 52, engagement: 68 },
    { month: 'Aug', retention: 58, engagement: 71 },
    { month: 'Sep', retention: 64, engagement: 75 },
    { month: 'Oct', retention: 68, engagement: 79 },
    { month: 'Nov', retention: 73, engagement: 82 }
  ];

  // Upcoming events
  const upcomingEvents = [
    {
      id: 1,
      name: 'Summer Music Festival 2025',
      date: '2025-06-15',
      time: '18:00',
      venue: 'Hyde Park, London',
      ticketsSold: 847,
      totalTickets: 1000,
      revenue: 42350,
      status: 'On Sale'
    },
    {
      id: 2,
      name: 'Jazz Night Live',
      date: '2025-07-22',
      time: '20:00',
      venue: 'Ronnie Scott\'s',
      ticketsSold: 124,
      totalTickets: 200,
      revenue: 6200,
      status: 'On Sale'
    },
    {
      id: 3,
      name: 'Comedy Special - Sarah Johnson',
      date: '2025-08-10',
      time: '19:30',
      venue: 'The Comedy Store',
      ticketsSold: 0,
      totalTickets: 150,
      revenue: 0,
      status: 'Draft'
    }
  ];

  // Recent activity
  const recentActivity = [
    { type: 'sale', event: 'Summer Music Festival', tickets: 5, time: '2 minutes ago', amount: 250 },
    { type: 'sale', event: 'Jazz Night Live', tickets: 2, time: '15 minutes ago', amount: 100 },
    { type: 'transfer', event: 'Summer Music Festival', tickets: 1, time: '1 hour ago' },
    { type: 'sale', event: 'Summer Music Festival', tickets: 3, time: '2 hours ago', amount: 150 },
    { type: 'refund', event: 'Jazz Night Live', tickets: 1, time: '3 hours ago', amount: 50 }
  ];

  // Early warnings
  const warnings = [
    {
      type: 'warning',
      priority: 'high',
      title: 'Sales Slowing Down',
      description: 'Summer Music Festival sales decreased 30% this week',
      action: 'Send Reminder Email',
      actionLink: '/organizer/marketing'
    },
    {
      type: 'info',
      priority: 'medium',
      title: 'Weather Update',
      description: 'Rain forecast for Summer Music Festival on June 15',
      action: 'Add Weather Note',
      actionLink: '/organizer/manage-events/1'
    },
    {
      type: 'success',
      priority: 'low',
      title: 'Milestone Reached',
      description: 'Jazz Night Live just hit 60% capacity!',
      action: 'Share Achievement',
      actionLink: '/organizer/share'
    }
  ];

  // Marketing suggestions
  const marketingSuggestions = [
    {
      icon: Mail,
      title: 'Send Email Campaign',
      description: 'Last email sent 8 days ago. Similar organizers see 23% sales boost with weekly emails.',
      action: 'Draft Email'
    },
    {
      icon: Share2,
      title: 'Social Media Boost',
      description: 'Your Summer Festival post got 2.4K views. Try posting between 6-8 PM for 40% more reach.',
      action: 'Schedule Post'
    },
    {
      icon: Target,
      title: 'Early Bird Pricing',
      description: 'Add early bird tickets for Jazz Night. Events with early pricing sell 35% faster.',
      action: 'Add Pricing Tier'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <Ticket className="w-4 h-4 text-green-400" />;
      case 'transfer':
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case 'refund':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'info':
        return <Bell className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">
          Welcome back, {organizerName} 👋
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Here's what's happening with your events today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>12%</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Revenue</p>
          <p className="text-white font-bold text-xl sm:text-2xl">£{totalRevenue.toLocaleString()}</p>
        </div>

        {/* Tickets Sold */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <div className="flex items-center gap-1 text-blue-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>8%</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Tickets Sold</p>
          <p className="text-white font-bold text-xl sm:text-2xl">{ticketsSold.toLocaleString()}</p>
        </div>

        {/* Total Events */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Events</p>
          <p className="text-white font-bold text-xl sm:text-2xl">{totalEvents}</p>
        </div>

        {/* Active Fans */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            <div className="flex items-center gap-1 text-orange-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>15%</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Active Fans</p>
          <p className="text-white font-bold text-xl sm:text-2xl">3,247</p>
        </div>
      </div>

          {/* WIDGET 3: Quick Actions Hub */}
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <h2 className="text-white font-bold text-lg sm:text-xl">Quick Actions</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              <Link href="/organizer/create-event" className="flex-1">
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span>Create Event</span>
                </button>
              </Link>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>Email Fans</span>
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col items-center gap-2">
                <Share2 className="w-5 h-5" />
                <span>Post Update</span>
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span>Withdraw</span>
              </button>
              <Link href="/organizer/manage-events" className="flex-1">
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col items-center gap-2">
                  <Edit className="w-5 h-5" />
                  <span>Manage</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Two Column Layout - Payout + Early Warning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* WIDGET 1: Real-Time Payout Tracker */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h2 className="text-white font-bold text-lg sm:text-xl">Available Now</h2>
                </div>
                <button className="text-green-400 hover:text-green-300 text-xs sm:text-sm font-medium">
                  View History
                </button>
              </div>

              {/* Big payout amount */}
              <div className="mb-6">
                <p className="text-green-400 text-4xl sm:text-5xl font-bold mb-2">
                  £{availablePayout.toLocaleString()}
                </p>
                <p className="text-green-300/60 text-xs sm:text-sm">
                  Ready for instant withdrawal
                </p>
              </div>

              {/* Withdraw button */}
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-colors mb-4 flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                Withdraw to Bank
              </button>

              {/* Next payout info */}
              <div className="bg-black/30 rounded-xl p-3 sm:p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs sm:text-sm">Next Payout</span>
                  <span className="text-white font-semibold text-xs sm:text-sm">£2,140</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>Tomorrow 9:00 AM</span>
                </div>
              </div>

              {/* 7-day trend chart */}
              <div className="mb-3">
                <p className="text-gray-400 text-xs sm:text-sm mb-2">Last 7 Days</p>
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={revenueData.slice(-7)}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Info banner */}
              <div className="flex items-start gap-2 text-green-400/80 text-xs">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>No holds. No delays. Your money, available instantly.</span>
              </div>
            </div>

            {/* WIDGET 2: Early Warning System */}
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <h2 className="text-white font-bold text-lg sm:text-xl">Alerts & Recommendations</h2>
                </div>
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs font-semibold">
                  {warnings.length}
                </span>
              </div>

              <div className="space-y-3">
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-3 sm:p-4 border ${
                      warning.type === 'warning'
                        ? 'bg-orange-500/10 border-orange-500/30'
                        : warning.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getWarningIcon(warning.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-white font-semibold text-sm">{warning.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                            warning.priority === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : warning.priority === 'medium'
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {warning.priority}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm mb-3">
                          {warning.description}
                        </p>
                        <Link href={warning.actionLink}>
                          <button className={`text-xs sm:text-sm font-semibold flex items-center gap-1 ${
                            warning.type === 'warning'
                              ? 'text-orange-400 hover:text-orange-300'
                              : warning.type === 'success'
                              ? 'text-green-400 hover:text-green-300'
                              : 'text-blue-400 hover:text-blue-300'
                          } transition-colors`}>
                            {warning.action}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View all link */}
              <button className="w-full mt-4 text-center text-gray-400 hover:text-white text-xs sm:text-sm font-medium py-2 transition-colors">
                View All Alerts
              </button>
            </div>
          </div>

          {/* Revenue Chart (30 days) */}
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-white font-bold text-lg sm:text-xl mb-1">Revenue Overview</h2>
                <p className="text-gray-400 text-xs sm:text-sm">Last 30 days performance</p>
              </div>

              {/* Period selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPeriod('7days')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedPeriod === '7days'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setSelectedPeriod('30days')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedPeriod === '30days'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setSelectedPeriod('90days')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedPeriod === '90days'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  90 Days
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `£${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: any) => [`£${value}`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two Column Layout - Marketing + Fan Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* WIDGET 4: Marketing Co-Pilot */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-white font-bold text-lg sm:text-xl">Marketing Co-Pilot</h2>
                <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                  AI
                </span>
              </div>

              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                Smart suggestions to boost your ticket sales
              </p>

              <div className="space-y-3">
                {marketingSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <div key={index} className="bg-black/30 rounded-xl p-3 sm:p-4 hover:bg-black/40 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm mb-1">
                            {suggestion.title}
                          </h3>
                          <p className="text-gray-400 text-xs mb-3">
                            {suggestion.description}
                          </p>
                          <button className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors">
                            {suggestion.action}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI disclaimer */}
              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <p className="text-purple-400/60 text-xs">
                  💡 Powered by AI • Based on 10,000+ successful events
                </p>
              </div>
            </div>

            {/* WIDGET 5: Fan Relationship Health */}
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h2 className="text-white font-bold text-lg sm:text-xl">Fan Health</h2>
                </div>
                <Link href="/organizer/analytics">
                  <button className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium">
                    View Details
                  </button>
                </Link>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-800 rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Retention Rate</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-bold text-xl">73%</span>
                    <span className="text-green-400 text-xs flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      12%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Repeat Buyers</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-bold text-xl">342</span>
                    <span className="text-green-400 text-xs flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      8%
                    </span>
                  </div>
                </div>
              </div>

              {/* Trend chart */}
              <div className="mb-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-3">6-Month Trends</p>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fanHealthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="month"
                        stroke="#9ca3af"
                        style={{ fontSize: '10px' }}
                      />
                      <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '10px' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="retention"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Retention %"
                      />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Engagement %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Additional stats */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Avg Lifetime Value</span>
                  <span className="text-white font-semibold">£287</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Top Fan</span>
                  <span className="text-white font-semibold">Sarah M. (5 events)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Top Location</span>
                  <span className="text-white font-semibold">London (42%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 6: Transfer & Resale Insights */}
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-green-400" />
                <h2 className="text-white font-bold text-lg sm:text-xl">Ticket Movement</h2>
              </div>
              <span className="text-gray-400 text-xs sm:text-sm">This Month</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {/* Free Transfers */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold text-sm">Free Transfers</span>
                </div>
                <p className="text-white font-bold text-3xl mb-1">247</p>
                <p className="text-gray-400 text-xs">100% free • No charges</p>
                
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-blue-400 text-xs mt-1">85% completion rate</p>
                </div>
              </div>

              {/* Fair Resales */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm">Fair Resales</span>
                </div>
                <p className="text-white font-bold text-3xl mb-1">89</p>
                <p className="text-gray-400 text-xs">Avg 104% of face value</p>
                
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <p className="text-green-400 text-xs mt-1">All under 110% cap</p>
                </div>
              </div>

              {/* Scalped Tickets */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold text-sm">Scalped Tickets</span>
                </div>
                <p className="text-white font-bold text-3xl mb-1">0</p>
                <p className="text-gray-400 text-xs">No price gouging</p>
                
                {/* Success indicator */}
                <div className="mt-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-green-400 text-xs font-medium">100% Protected</p>
                </div>
              </div>
            </div>

            {/* Success message */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-400 font-semibold text-sm">Your tickets stayed accessible to real fans</p>
              </div>
              <p className="text-gray-400 text-xs">
                Zero scalping detected • Fair pricing maintained • Happy customers
              </p>
            </div>
          </div>

          {/* Upcoming Events + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Upcoming Events (2/3 width) */}
            <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <h2 className="text-white font-bold text-lg sm:text-xl">Upcoming Events</h2>
                </div>
                <Link href="/organizer/manage-events">
                  <button className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium">
                    View All
                  </button>
                </Link>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                          {event.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-gray-400 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                          event.status === 'On Sale'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          {event.ticketsSold} / {event.totalTickets} sold
                        </span>
                        <span className="text-white font-semibold">
                          {Math.round((event.ticketsSold / event.totalTickets) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                          style={{
                            width: `${(event.ticketsSold / event.totalTickets) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Revenue + Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-green-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-sm">
                          £{event.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/organizer/manage-events/${event.id}`}>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link href={`/events/${event.id}`}>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create new event CTA */}
              <Link href="/organizer/create-event">
                <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl text-gray-400 hover:text-purple-400 font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Event
                </button>
              </Link>
            </div>

            {/* Recent Activity (1/3 width) */}
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <h2 className="text-white font-bold text-base sm:text-lg">Recent Activity</h2>
                </div>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="pb-3 border-b border-gray-800 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs sm:text-sm mb-1">
                          <span className="font-semibold">{activity.tickets}</span>{' '}
                          {activity.type === 'sale'
                            ? 'tickets sold'
                            : activity.type === 'transfer'
                            ? 'ticket transferred'
                            : 'ticket refunded'}
                        </p>
                        <p className="text-gray-500 text-xs truncate">{activity.event}</p>
                        {activity.amount && (
                          <p className="text-green-400 text-xs font-semibold mt-1">
                            +£{activity.amount}
                          </p>
                        )}
                        <p className="text-gray-600 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-center text-gray-400 hover:text-white text-xs font-medium py-2 transition-colors">
                View All Activity
              </button>
            </div>
          </div>
      </div>
  );
}