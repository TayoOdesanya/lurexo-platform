'use client';

import { useState } from 'react';
import {
  Activity,
  User,
  LogIn,
  LogOut,
  ShoppingBag,
  Ticket,
  CreditCard,
  Shield,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  MapPin,
  Monitor,
  Smartphone,
  Globe,
} from 'lucide-react';
import { mockUserActivities, mockActivityStats } from '../../../../lib/mockData/adminStats';

type ActivityType = 'all' | 'login' | 'purchase' | 'ticket' | 'profile' | 'security' | 'suspicious';
type TimeRange = '24h' | '7d' | '30d' | '90d';

export default function UserActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState<ActivityType>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [refreshing, setRefreshing] = useState(false);

  const stats = mockActivityStats;
  const activities = mockUserActivities;

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const getActivityIcon = (type: string) => {
    const configs = {
      login: { icon: LogIn, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
      logout: { icon: LogOut, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
      purchase: { icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
      ticket: { icon: Ticket, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
      profile: { icon: User, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
      security: { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
      suspicious: { icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
    };
    return configs[type as keyof typeof configs] || configs.login;
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'desktop':
        return <Monitor className="w-3.5 h-3.5" />;
      default:
        return <Globe className="w-3.5 h-3.5" />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    // Type filter
    if (activityFilter !== 'all' && activity.type !== activityFilter) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        activity.userName.toLowerCase().includes(query) ||
        activity.userEmail.toLowerCase().includes(query) ||
        activity.action.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            User Activity
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Monitor all user actions and platform activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-4 py-2 bg-slate-800 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Activities */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Activities</p>
          <p className="text-white font-bold text-3xl">{stats.totalActivities.toLocaleString()}</p>
          <p className="text-indigo-400 text-xs mt-2">Last 24 hours</p>
        </div>

        {/* Active Now */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <User className="w-6 h-6 text-emerald-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.activeChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.activeChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.activeChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Active Now</p>
          <p className="text-white font-bold text-3xl">{stats.activeNow}</p>
          <p className="text-emerald-400 text-xs mt-2">Currently online</p>
        </div>

        {/* Login Attempts */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <LogIn className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.loginChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.loginChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.loginChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Login Attempts</p>
          <p className="text-white font-bold text-3xl">{stats.loginAttempts.toLocaleString()}</p>
          <p className="text-blue-400 text-xs mt-2">Last 24 hours</p>
        </div>

        {/* Suspicious Activity */}
        <div className="bg-gradient-to-br from-rose-500/10 to-red-500/10 rounded-xl p-6 border border-rose-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-500/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-rose-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.suspiciousChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.suspiciousChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.suspiciousChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Suspicious Activity</p>
          <p className="text-white font-bold text-3xl">{stats.suspiciousActivity}</p>
          <p className="text-rose-400 text-xs mt-2">Requires attention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-1 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1">
          <button
            onClick={() => setActivityFilter('all')}
            className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activityFilter === 'all'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActivityFilter('login')}
            className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activityFilter === 'login'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Logins
          </button>
          <button
            onClick={() => setActivityFilter('purchase')}
            className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activityFilter === 'purchase'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Purchases
          </button>
          <button
            onClick={() => setActivityFilter('ticket')}
            className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activityFilter === 'ticket'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tickets
          </button>
          <button
            onClick={() => setActivityFilter('profile')}
            className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activityFilter === 'profile'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActivityFilter('security')}
            className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activityFilter === 'security'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActivityFilter('suspicious')}
            className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activityFilter === 'suspicious'
                ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Suspicious
          </button>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user, action, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
        <div className="divide-y divide-slate-700/30">
          {filteredActivities.map((activity) => {
            const { icon: Icon, color, bg, border } = getActivityIcon(activity.type);
            
            return (
              <div
                key={activity.id}
                className={`p-4 hover:bg-slate-800/50 transition-colors ${
                  activity.flagged ? 'bg-rose-500/5' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl ${bg} border ${border} flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">{activity.action}</h3>
                          {activity.flagged && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 rounded text-xs font-medium text-rose-400">
                              <AlertCircle className="w-3 h-3" />
                              Flagged
                            </span>
                          )}
                          {!activity.success && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-xs font-medium text-amber-400">
                              Failed
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{activity.description}</p>
                        
                        {/* User Info */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span className="text-white font-medium">{activity.userName}</span>
                            <span>({activity.userEmail})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {activity.location}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {getDeviceIcon(activity.device)}
                            {activity.device} • {activity.browser}
                          </div>
                          {activity.amount && (
                            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                              <CreditCard className="w-3.5 h-3.5" />
                              {formatCurrency(activity.amount)}
                            </div>
                          )}
                        </div>

                        {/* IP Address */}
                        <div className="mt-2">
                          <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">
                            IP: {activity.ipAddress}
                          </code>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          {getTimeAgo(activity.timestamp)}
                        </div>
                        <p className="text-slate-500 text-xs">{formatDateTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}