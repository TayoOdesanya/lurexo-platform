'use client';

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Calendar,
} from 'lucide-react';

export default function StripeReconciliationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'matched' | 'unmatched' | 'disputed'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const stats = {
    totalTransactions: 1247,
    matched: 1189,
    matchedPercentage: 95.3,
    unmatched: 42,
    unmatchedPercentage: 3.4,
    disputed: 16,
    disputedPercentage: 1.3,
    totalVolume: 487650.00,
    volumeChange: 12.5,
  };

  const reconciliationData = [
    {
      id: 'rec_1',
      date: '2026-01-20T14:30:00Z',
      stripeId: 'ch_3OQxYZ2eZvKYlo2C1234abcd',
      platformOrderId: 'ORD-2026-001234',
      eventName: 'Summer Music Festival 2026',
      amount: 12450.00,
      stripeFee: 394.50,
      platformFee: 622.50,
      status: 'matched' as const,
      customer: 'john.smith@email.com',
    },
    {
      id: 'rec_2',
      date: '2026-01-20T13:15:00Z',
      stripeId: 'ch_3OQxYZ2eZvKYlo2C5678efgh',
      platformOrderId: 'ORD-2026-001235',
      eventName: 'Jazz Night Live',
      amount: 8900.00,
      stripeFee: 282.00,
      platformFee: 445.00,
      status: 'matched' as const,
      customer: 'sarah.jones@email.com',
    },
    {
      id: 'rec_3',
      date: '2026-01-20T12:45:00Z',
      stripeId: 'ch_3OQxYZ2eZvKYlo2C9012ijkl',
      platformOrderId: null,
      eventName: 'Unknown Event',
      amount: 3200.00,
      stripeFee: 101.40,
      platformFee: 0,
      status: 'unmatched' as const,
      customer: 'unknown@email.com',
      issue: 'No matching platform order found',
    },
    {
      id: 'rec_4',
      date: '2026-01-20T11:20:00Z',
      stripeId: 'ch_3OQxYZ2eZvKYlo2C3456mnop',
      platformOrderId: 'ORD-2026-001236',
      eventName: 'Tech Conference 2026',
      amount: 15600.00,
      stripeFee: 494.40,
      platformFee: 780.00,
      status: 'disputed' as const,
      customer: 'mary.wilson@email.com',
      issue: 'Amount mismatch: Platform shows £15,500',
    },
    {
      id: 'rec_5',
      date: '2026-01-20T10:05:00Z',
      stripeId: null,
      platformOrderId: 'ORD-2026-001237',
      eventName: 'Comedy Special',
      amount: 4500.00,
      stripeFee: 0,
      platformFee: 225.00,
      status: 'unmatched' as const,
      customer: 'david.brown@email.com',
      issue: 'No matching Stripe charge found',
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

  const getStatusBadge = (status: string) => {
    const configs = {
      matched: {
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Matched',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
      },
      unmatched: {
        icon: <AlertCircle className="w-3 h-3" />,
        label: 'Unmatched',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
      },
      disputed: {
        icon: <XCircle className="w-3 h-3" />,
        label: 'Disputed',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
      },
    };
    const config = configs[status as keyof typeof configs] || configs.matched;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${config.bg} ${config.border} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const filteredData = reconciliationData.filter(item => {
    if (selectedFilter !== 'all' && item.status !== selectedFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.eventName.toLowerCase().includes(query) ||
        item.customer.toLowerCase().includes(query) ||
        item.stripeId?.toLowerCase().includes(query) ||
        item.platformOrderId?.toLowerCase().includes(query)
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
            Stripe Reconciliation
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Match platform transactions with Stripe payment records
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Transactions */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-indigo-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.volumeChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.volumeChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.volumeChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Transactions</p>
          <p className="text-white font-bold text-3xl">{stats.totalTransactions}</p>
          <p className="text-indigo-400 text-xs mt-2">{formatCurrency(stats.totalVolume)}</p>
        </div>

        {/* Matched */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              {stats.matchedPercentage}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Matched</p>
          <p className="text-white font-bold text-3xl">{stats.matched}</p>
          <p className="text-emerald-400 text-xs mt-2">Successfully reconciled</p>
        </div>

        {/* Unmatched */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-amber-400">
              {stats.unmatchedPercentage}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Unmatched</p>
          <p className="text-white font-bold text-3xl">{stats.unmatched}</p>
          <p className="text-amber-400 text-xs mt-2">Needs investigation</p>
        </div>

        {/* Disputed */}
        <div className="bg-gradient-to-br from-rose-500/10 to-red-500/10 rounded-xl p-6 border border-rose-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-rose-400">
              {stats.disputedPercentage}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Disputed</p>
          <p className="text-white font-bold text-3xl">{stats.disputed}</p>
          <p className="text-rose-400 text-xs mt-2">Requires attention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-1 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({reconciliationData.length})
          </button>
          <button
            onClick={() => setSelectedFilter('matched')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedFilter === 'matched'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Matched ({reconciliationData.filter(r => r.status === 'matched').length})
          </button>
          <button
            onClick={() => setSelectedFilter('unmatched')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedFilter === 'unmatched'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unmatched ({reconciliationData.filter(r => r.status === 'unmatched').length})
          </button>
          <button
            onClick={() => setSelectedFilter('disputed')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedFilter === 'disputed'
                ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Disputed ({reconciliationData.filter(r => r.status === 'disputed').length})
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
              placeholder="Search by event, customer, Stripe ID, or order ID..."
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

      {/* Reconciliation Table */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Stripe ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Platform Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Stripe Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">{formatDateTime(record.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{record.eventName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300 text-sm">{record.customer}</p>
                  </td>
                  <td className="px-6 py-4">
                    {record.stripeId ? (
                      <code className="text-xs bg-slate-800 px-2 py-1 rounded text-indigo-400 font-mono">
                        {record.stripeId.slice(0, 20)}...
                      </code>
                    ) : (
                      <span className="text-slate-500 text-sm italic">No Stripe record</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {record.platformOrderId ? (
                      <code className="text-xs bg-slate-800 px-2 py-1 rounded text-purple-400 font-mono">
                        {record.platformOrderId}
                      </code>
                    ) : (
                      <span className="text-slate-500 text-sm italic">No platform order</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-white font-semibold">{formatCurrency(record.amount)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-slate-400">{formatCurrency(record.stripeFee)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {getStatusBadge(record.status)}
                      {record.issue && (
                        <p className="text-rose-400 text-xs">{record.issue}</p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-slate-700/30">
          {filteredData.map((record) => (
            <div key={record.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white font-medium mb-1">{record.eventName}</p>
                  <p className="text-slate-400 text-sm">{record.customer}</p>
                </div>
                {getStatusBadge(record.status)}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4" />
                {formatDateTime(record.date)}
              </div>

              {record.issue && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
                  <p className="text-rose-400 text-sm font-medium mb-1">Issue:</p>
                  <p className="text-rose-300 text-sm">{record.issue}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-500 text-xs mb-1">Amount</p>
                  <p className="text-white font-semibold">{formatCurrency(record.amount)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Stripe Fee</p>
                  <p className="text-slate-400 font-medium">{formatCurrency(record.stripeFee)}</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-700/50">
                <div>
                  <p className="text-slate-500 text-xs mb-1">Stripe ID</p>
                  {record.stripeId ? (
                    <code className="text-xs bg-slate-800 px-2 py-1 rounded text-indigo-400 font-mono block">
                      {record.stripeId}
                    </code>
                  ) : (
                    <span className="text-slate-500 text-sm italic">No Stripe record</span>
                  )}
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Platform Order</p>
                  {record.platformOrderId ? (
                    <code className="text-xs bg-slate-800 px-2 py-1 rounded text-purple-400 font-mono block">
                      {record.platformOrderId}
                    </code>
                  ) : (
                    <span className="text-slate-500 text-sm italic">No platform order</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}