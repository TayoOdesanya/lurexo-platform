'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Search,
  Pause,
  ArrowUpRight,
} from 'lucide-react';

export default function PayoutsPage() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const stats = {
    pendingPayouts: 12,
    pendingAmount: 45250.00,
    pendingChange: -8.3,
    processingToday: 8,
    processingAmount: 32100.00,
    processingChange: 12.5,
    completedThisWeek: 156,
    completedAmount: 189750.00,
    completedChange: 18.7,
    failedThisMonth: 3,
    failedAmount: 4500.00,
    failedChange: -25.0,
  };

  const pendingPayouts = [
    {
      id: 'payout_1',
      organizerId: 'org_123',
      organizerName: 'Manchester Music Events',
      organizerEmail: 'contact@manchestermusic.com',
      amount: 12450.00,
      platformFee: 622.50,
      netAmount: 11827.50,
      eventCount: 3,
      dateRange: 'Jan 1 - Jan 15, 2026',
      status: 'pending' as const,
      scheduledFor: '2026-01-20',
      riskFlags: ['high_amount'] as const[],
      bankAccountLast4: '1234',
    },
    {
      id: 'payout_2',
      organizerId: 'org_456',
      organizerName: 'London Theatre Co.',
      organizerEmail: 'info@londontheatre.co.uk',
      amount: 8900.00,
      platformFee: 445.00,
      netAmount: 8455.00,
      eventCount: 2,
      dateRange: 'Jan 1 - Jan 15, 2026',
      status: 'pending' as const,
      scheduledFor: '2026-01-20',
      riskFlags: [] as const[],
      bankAccountLast4: '5678',
    },
    {
      id: 'payout_3',
      organizerId: 'org_789',
      organizerName: 'Birmingham Sports Arena',
      organizerEmail: 'payments@bsarena.com',
      amount: 3200.00,
      platformFee: 160.00,
      netAmount: 3040.00,
      eventCount: 1,
      dateRange: 'Jan 10 - Jan 15, 2026',
      status: 'pending' as const,
      scheduledFor: '2026-01-20',
      riskFlags: ['new_organizer'] as const[],
      bankAccountLast4: '9012',
    },
  ];

  const processingPayouts = [
    {
      id: 'payout_proc_1',
      organizerId: 'org_444',
      organizerName: 'Edinburgh Festival Ltd',
      organizerEmail: 'finance@edifest.com',
      amount: 15600.00,
      platformFee: 780.00,
      netAmount: 14820.00,
      eventCount: 4,
      dateRange: 'Jan 5 - Jan 15, 2026',
      status: 'processing' as const,
      initiatedAt: '2026-01-20T09:00:00Z',
      bankAccountLast4: '3456',
    },
  ];

  const completedPayouts = [
    {
      id: 'payout_comp_1',
      organizerId: 'org_111',
      organizerName: 'Cardiff Concert Hall',
      organizerEmail: 'payments@cardiffhall.com',
      amount: 25600.00,
      platformFee: 1280.00,
      netAmount: 24320.00,
      eventCount: 5,
      dateRange: 'Dec 15 - Dec 31, 2025',
      status: 'completed' as const,
      completedAt: '2026-01-05T14:30:00Z',
      bankAccountLast4: '3456',
    },
    {
      id: 'payout_comp_2',
      organizerId: 'org_222',
      organizerName: 'Bristol Music Venue',
      organizerEmail: 'finance@bristolmusic.co.uk',
      amount: 15800.00,
      platformFee: 790.00,
      netAmount: 15010.00,
      eventCount: 3,
      dateRange: 'Dec 15 - Dec 31, 2025',
      status: 'completed' as const,
      completedAt: '2026-01-05T16:45:00Z',
      bankAccountLast4: '7890',
    },
  ];

  const failedPayouts = [
    {
      id: 'payout_fail_1',
      organizerId: 'org_333',
      organizerName: 'Glasgow Events Ltd',
      organizerEmail: 'info@glasgowevents.com',
      amount: 4500.00,
      platformFee: 225.00,
      netAmount: 4275.00,
      eventCount: 1,
      dateRange: 'Dec 20 - Dec 31, 2025',
      status: 'failed' as const,
      failedAt: '2026-01-06T10:20:00Z',
      failureReason: 'Invalid bank account details',
      bankAccountLast4: '0000',
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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

  const handleSelectPayout = (payoutId: string) => {
    setSelectedPayouts(prev =>
      prev.includes(payoutId)
        ? prev.filter(id => id !== payoutId)
        : [...prev, payoutId]
    );
  };

  const handleSelectAll = () => {
    const currentPayouts = selectedTab === 'pending' ? pendingPayouts : [];
    if (selectedPayouts.length === currentPayouts.length) {
      setSelectedPayouts([]);
    } else {
      setSelectedPayouts(currentPayouts.map(p => p.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: {
        icon: <Clock className="w-3 h-3" />,
        label: 'Pending',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
      },
      processing: {
        icon: <RefreshCw className="w-3 h-3 animate-spin" />,
        label: 'Processing',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
      },
      completed: {
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Completed',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
      },
      failed: {
        icon: <XCircle className="w-3 h-3" />,
        label: 'Failed',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
      },
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${config.bg} ${config.border} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getRiskFlagBadge = (flag: string) => {
    const configs = {
      high_amount: {
        label: 'High Amount',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
      },
      new_organizer: {
        label: 'New Organizer',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
      },
    };
    const config = configs[flag as keyof typeof configs];
    if (!config) return null;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${config.bg} ${config.border} ${config.text}`}>
        <AlertTriangle className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getCurrentPayouts = () => {
    switch (selectedTab) {
      case 'pending': return pendingPayouts;
      case 'processing': return processingPayouts;
      case 'completed': return completedPayouts;
      case 'failed': return failedPayouts;
      default: return pendingPayouts;
    }
  };

  const currentPayouts = getCurrentPayouts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Payouts Management
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Process and manage organizer payouts
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
          <Link
            href="/admin/financials/payouts/stripe-reconciliation"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2"
          >
            Stripe Reconciliation
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Payouts */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.pendingChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.pendingChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.pendingChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Pending Payouts</p>
          <p className="text-white font-bold text-3xl">{stats.pendingPayouts}</p>
          <p className="text-amber-400 text-xs mt-2">{formatCurrency(stats.pendingAmount)}</p>
        </div>

        {/* Processing Today */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <RefreshCw className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.processingChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.processingChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.processingChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Processing Today</p>
          <p className="text-white font-bold text-3xl">{stats.processingToday}</p>
          <p className="text-blue-400 text-xs mt-2">{formatCurrency(stats.processingAmount)}</p>
        </div>

        {/* Completed This Week */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.completedChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.completedChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.completedChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Completed This Week</p>
          <p className="text-white font-bold text-3xl">{stats.completedThisWeek}</p>
          <p className="text-emerald-400 text-xs mt-2">{formatCurrency(stats.completedAmount)}</p>
        </div>

        {/* Failed This Month */}
        <div className="bg-gradient-to-br from-rose-500/10 to-red-500/10 rounded-xl p-6 border border-rose-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-500/20 rounded-lg">
              <XCircle className="w-6 h-6 text-rose-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.failedChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.failedChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.failedChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Failed This Month</p>
          <p className="text-white font-bold text-3xl">{stats.failedThisMonth}</p>
          <p className="text-rose-400 text-xs mt-2">{formatCurrency(stats.failedAmount)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-1 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedTab === 'pending'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending ({pendingPayouts.length})
          </button>
          <button
            onClick={() => setSelectedTab('processing')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedTab === 'processing'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Processing ({processingPayouts.length})
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedTab === 'completed'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({completedPayouts.length})
          </button>
          <button
            onClick={() => setSelectedTab('failed')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedTab === 'failed'
                ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Failed ({failedPayouts.length})
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
              placeholder="Search by organizer name or email..."
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

      {/* Batch Actions for Pending Tab */}
      {selectedTab === 'pending' && selectedPayouts.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-white font-medium">
              {selectedPayouts.length} payout{selectedPayouts.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors font-medium">
                Approve All
              </button>
              <button className="px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 transition-colors font-medium">
                Hold All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payouts List */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700/50">
              <tr>
                {selectedTab === 'pending' && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPayouts.length === pendingPayouts.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500/50"
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Organizer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Period
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Platform Fee
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Net Payout
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {selectedTab === 'pending' ? 'Scheduled' : selectedTab === 'processing' ? 'Initiated' : selectedTab === 'completed' ? 'Completed' : 'Failed'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {currentPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-slate-800/50 transition-colors">
                  {selectedTab === 'pending' && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPayouts.includes(payout.id)}
                        onChange={() => handleSelectPayout(payout.id)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500/50"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <Building2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{payout.organizerName}</p>
                        <p className="text-slate-400 text-xs">{payout.organizerEmail}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{payout.eventCount} events</span>
                          {'riskFlags' in payout && payout.riskFlags.map((flag) => (
                            <span key={flag}>{getRiskFlagBadge(flag)}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300 text-sm">{payout.dateRange}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-white font-medium">{formatCurrency(payout.amount)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-slate-400">{formatCurrency(payout.platformFee)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-emerald-400 font-semibold">{formatCurrency(payout.netAmount)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">****{payout.bankAccountLast4}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payout.status)}
                  </td>
                  <td className="px-6 py-4">
                    {'scheduledFor' in payout && (
                      <p className="text-slate-300 text-sm">{formatDate(payout.scheduledFor)}</p>
                    )}
                    {'initiatedAt' in payout && (
                      <p className="text-slate-300 text-sm">{formatDateTime(payout.initiatedAt)}</p>
                    )}
                    {'completedAt' in payout && (
                      <p className="text-slate-300 text-sm">{formatDateTime(payout.completedAt)}</p>
                    )}
                    {'failedAt' in payout && (
                      <>
                        <p className="text-slate-300 text-sm">{formatDateTime(payout.failedAt)}</p>
                        <p className="text-rose-400 text-xs mt-1">{payout.failureReason}</p>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-slate-700/30">
          {currentPayouts.map((payout) => (
            <div key={payout.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {selectedTab === 'pending' && (
                    <input
                      type="checkbox"
                      checked={selectedPayouts.includes(payout.id)}
                      onChange={() => handleSelectPayout(payout.id)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500/50 mt-1"
                    />
                  )}
                  <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Building2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{payout.organizerName}</p>
                    <p className="text-slate-400 text-xs truncate">{payout.organizerEmail}</p>
                  </div>
                </div>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                {getStatusBadge(payout.status)}
                {'riskFlags' in payout && payout.riskFlags.map((flag) => (
                  <span key={flag}>{getRiskFlagBadge(flag)}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-slate-500 text-xs">Period</p>
                  <p className="text-white text-sm font-medium mt-1">{payout.dateRange}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">
                    {selectedTab === 'pending' ? 'Scheduled' : selectedTab === 'processing' ? 'Initiated' : selectedTab === 'completed' ? 'Completed' : 'Failed'}
                  </p>
                  {'scheduledFor' in payout && (
                    <p className="text-white text-sm font-medium mt-1">{formatDate(payout.scheduledFor)}</p>
                  )}
                  {'initiatedAt' in payout && (
                    <p className="text-white text-sm font-medium mt-1">{formatDateTime(payout.initiatedAt)}</p>
                  )}
                  {'completedAt' in payout && (
                    <p className="text-white text-sm font-medium mt-1">{formatDateTime(payout.completedAt)}</p>
                  )}
                  {'failedAt' in payout && (
                    <p className="text-white text-sm font-medium mt-1">{formatDateTime(payout.failedAt)}</p>
                  )}
                </div>
              </div>

              {'failureReason' in payout && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 mb-3">
                  <p className="text-rose-400 text-sm font-medium">Failure Reason:</p>
                  <p className="text-rose-300 text-sm mt-1">{payout.failureReason}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-700/50">
                <div>
                  <p className="text-slate-500 text-xs">Amount</p>
                  <p className="text-white font-medium text-sm mt-1">{formatCurrency(payout.amount)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Fee</p>
                  <p className="text-slate-400 text-sm mt-1">{formatCurrency(payout.platformFee)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Net</p>
                  <p className="text-emerald-400 font-semibold text-sm mt-1">{formatCurrency(payout.netAmount)}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700/50 mt-3">
                <p className="text-slate-500 text-xs mb-1">Bank Account</p>
                <p className="text-slate-300 text-sm">****{payout.bankAccountLast4}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}