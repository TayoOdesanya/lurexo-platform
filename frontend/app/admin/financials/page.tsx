'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  RefreshCw,
  Wallet,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
} from 'lucide-react';

export default function FinancialsPage() {
  const [timeframe, setTimeframe] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock financial data
  const stats = {
    totalRevenue: 487650,
    revenueChange: 12.5,
    platformFees: 39012,
    feesChange: 15.2,
    pendingPayouts: 124500,
    payoutsChange: -8.3,
    completedPayouts: 324138,
    completedChange: 18.7,
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'payout',
      organizer: 'EventCo Ltd',
      amount: 45000,
      platformFee: 3600,
      status: 'completed',
      date: '2026-01-18T14:30:00Z',
      event: 'Summer Music Festival 2025',
    },
    {
      id: 2,
      type: 'payout',
      organizer: 'Live Nation UK',
      amount: 78000,
      platformFee: 6240,
      status: 'pending',
      date: '2026-01-19T10:15:00Z',
      event: 'Jazz Night Live',
    },
    {
      id: 3,
      type: 'refund',
      organizer: 'City Events Ltd',
      amount: -1200,
      platformFee: -96,
      status: 'completed',
      date: '2026-01-17T16:45:00Z',
      event: 'Tech Conference 2025',
    },
    {
      id: 4,
      type: 'payout',
      organizer: 'Romance Events',
      amount: 12500,
      platformFee: 1000,
      status: 'processing',
      date: '2026-01-20T09:00:00Z',
      event: 'Food & Wine Festival',
    },
    {
      id: 5,
      type: 'payout',
      organizer: 'Night Owls Ltd',
      amount: 23400,
      platformFee: 1872,
      status: 'completed',
      date: '2026-01-16T11:20:00Z',
      event: 'Comedy Special',
    },
  ];

  const revenueByCategory = [
    { category: 'Music', revenue: 234500, percentage: 48 },
    { category: 'Sports', revenue: 98700, percentage: 20 },
    { category: 'Comedy', revenue: 67800, percentage: 14 },
    { category: 'Theatre', revenue: 45600, percentage: 9 },
    { category: 'Other', revenue: 41050, percentage: 9 },
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      completed: {
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Completed',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
      },
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
      failed: {
        icon: <AlertCircle className="w-3 h-3" />,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Financial Dashboard
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Platform revenue, payouts, and financial metrics
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
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-indigo-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.revenueChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.revenueChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.revenueChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Revenue</p>
          <p className="text-white font-bold text-3xl">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-slate-500 text-xs mt-2">Gross ticket sales</p>
        </div>

        {/* Platform Fees */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.feesChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.feesChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.feesChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Platform Fees</p>
          <p className="text-white font-bold text-3xl">{formatCurrency(stats.platformFees)}</p>
          <p className="text-slate-500 text-xs mt-2">8% commission earned</p>
        </div>

        {/* Pending Payouts */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.payoutsChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.payoutsChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.payoutsChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Pending Payouts</p>
          <p className="text-white font-bold text-3xl">{formatCurrency(stats.pendingPayouts)}</p>
          <Link href="/admin/financials/payouts" className="text-amber-400 text-xs mt-2 hover:text-amber-300 transition-colors inline-flex items-center gap-1">
            Review payouts
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Completed Payouts */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stats.completedChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.completedChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.completedChange)}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Completed Payouts</p>
          <p className="text-white font-bold text-3xl">{formatCurrency(stats.completedPayouts)}</p>
          <p className="text-slate-500 text-xs mt-2">Paid to organizers</p>
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">Revenue by Category</h2>
          <button className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors flex items-center gap-1">
            View all
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {revenueByCategory.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  <span className="text-slate-300 font-medium">{item.category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 text-sm">{item.percentage}%</span>
                  <span className="text-white font-bold">{formatCurrency(item.revenue)}</span>
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-xl">Recent Transactions</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Organizer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Platform Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <Building2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-white font-medium">{transaction.organizer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">{transaction.event}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.type === 'payout' 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {transaction.type === 'payout' ? 'Payout' : 'Refund'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${transaction.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-slate-300 font-medium">
                      {formatCurrency(Math.abs(transaction.platformFee))}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-sm">{formatDate(transaction.date)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-slate-700/30">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Building2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{transaction.organizer}</p>
                    <p className="text-slate-400 text-xs">{transaction.event}</p>
                  </div>
                </div>
                {getStatusBadge(transaction.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-slate-500 text-xs">Amount</p>
                  <p className={`font-bold ${transaction.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Platform Fee</p>
                  <p className="text-white font-medium">{formatCurrency(Math.abs(transaction.platformFee))}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-1 rounded font-medium ${
                  transaction.type === 'payout' 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {transaction.type === 'payout' ? 'Payout' : 'Refund'}
                </span>
                <span className="text-slate-400">{formatDate(transaction.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}