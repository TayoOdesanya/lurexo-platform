'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Wallet,
  CreditCard,
  Percent,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

type TimeRange = '7d' | '30d' | '90d' | '1y';

export default function RevenueAnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Mock revenue data
  const revenueStats = {
    totalRevenue: 487293,
    revenueGrowth: 28.5,
    platformFees: 24365,
    organizerPayouts: 438563,
    stripeFees: 14365,
    netRevenue: 9635,
    avgRevenuePerDay: 16243,
    avgRevenuePerEvent: 1425,
  };

  const revenueBreakdown = [
    { name: 'Organizer Payouts', amount: 438563, percentage: 90.0, color: 'from-purple-500 to-pink-500' },
    { name: 'Platform Fees', amount: 24365, percentage: 5.0, color: 'from-emerald-500 to-teal-500' },
    { name: 'Stripe Fees', amount: 14365, percentage: 2.9, color: 'from-blue-500 to-cyan-500' },
    { name: 'Net Revenue', amount: 9635, percentage: 2.1, color: 'from-indigo-500 to-purple-500' },
  ];

  const monthlyRevenue = [
    { month: 'Aug', revenue: 42500, growth: 12.5 },
    { month: 'Sep', revenue: 48200, growth: 13.4 },
    { month: 'Oct', revenue: 56800, growth: 17.8 },
    { month: 'Nov', revenue: 51200, growth: -9.9 },
    { month: 'Dec', revenue: 78400, growth: 53.1 },
    { month: 'Jan', revenue: 89300, growth: 13.9 },
  ];

  const revenueByCategory = [
    { name: 'Music', revenue: 245000, percentage: 50.3 },
    { name: 'Sports', revenue: 156000, percentage: 32.0 },
    { name: 'Arts', revenue: 52000, percentage: 10.7 },
    { name: 'Tech', revenue: 28000, percentage: 5.7 },
    { name: 'Other', revenue: 6293, percentage: 1.3 },
  ];

  const topRevenueEvents = [
    { name: 'Summer Music Festival 2026', revenue: 117000, tickets: 2340, date: '2026-07-15' },
    { name: 'Tech Conference London', revenue: 189000, tickets: 1890, date: '2026-03-22' },
    { name: 'New Year Celebration 2026', revenue: 117000, tickets: 2340, date: '2026-01-31' },
    { name: 'Valentine\'s Concert', revenue: 39175, tickets: 1567, date: '2026-02-14' },
    { name: 'Christmas Market 2025', revenue: 135500, tickets: 5420, date: '2025-12-24' },
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
            Revenue Analytics
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Financial insights and revenue breakdown
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

      {/* Key Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              {revenueStats.revenueGrowth}%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Revenue</p>
          <p className="text-white font-bold text-3xl">{formatCurrency(revenueStats.totalRevenue)}</p>
          <p className="text-emerald-400 text-xs mt-2">All time</p>
        </div>

        {/* Platform Fees */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Percent className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Platform Fees</p>
          <p className="text-white font-bold text-3xl">{formatCurrency(revenueStats.platformFees)}</p>
          <p className="text-indigo-400 text-xs mt-2">5% commission</p>
        </div>

        {/* Avg Revenue/Day */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              15.2%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Avg Revenue/Day</p>
          <p className="text-white font-bold text-3xl">{formatCurrency(revenueStats.avgRevenuePerDay)}</p>
          <p className="text-blue-400 text-xs mt-2">Daily average</p>
        </div>

        {/* Net Revenue */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              42.8%
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Net Revenue</p>
          <p className="text-white font-bold text-3xl">{formatCurrency(revenueStats.netRevenue)}</p>
          <p className="text-purple-400 text-xs mt-2">After fees</p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-bold text-lg">Revenue Breakdown</h3>
        </div>

        <div className="space-y-4">
          {revenueBreakdown.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-slate-500 text-sm">{item.percentage}%</span>
                </div>
                <span className="text-white font-semibold">{formatCurrency(item.amount)}</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <h3 className="text-white font-bold text-lg mb-6">Monthly Revenue Trend</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {monthlyRevenue.map((month, index) => (
            <div key={index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">{month.month}</span>
                <div className={`flex items-center gap-1 text-xs font-medium ${month.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {month.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(month.growth)}%
                </div>
              </div>
              <p className="text-white font-bold text-xl">{formatCurrency(month.revenue)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <h3 className="text-white font-bold text-lg mb-6">Revenue by Category</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {revenueByCategory.map((category, index) => (
            <div key={index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">{category.name}</p>
                <p className="text-white font-bold text-2xl mb-1">{formatCurrency(category.revenue)}</p>
                <p className="text-slate-500 text-xs">{category.percentage}%</p>
              </div>
              <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Revenue Events */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <h3 className="text-white font-bold text-lg mb-6">Highest Revenue Events</h3>

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
                  Tickets
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Revenue
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Avg/Ticket
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {topRevenueEvents.map((event, index) => (
                <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-emerald-400 font-bold text-sm">#{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white font-medium">{event.name}</p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-white font-semibold">{event.tickets.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-emerald-400 font-bold text-lg">{formatCurrency(event.revenue)}</p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-slate-300 font-medium">{formatCurrency(event.revenue / event.tickets)}</p>
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
          {topRevenueEvents.map((event, index) => (
            <div key={index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex-shrink-0">
                  <span className="text-emerald-400 font-bold text-sm">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold mb-1">{event.name}</h4>
                  <p className="text-slate-400 text-xs">{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-slate-500 text-xs">Tickets</p>
                  <p className="text-white font-semibold">{event.tickets.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Revenue</p>
                  <p className="text-emerald-400 font-semibold">{formatCurrency(event.revenue)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Avg/Ticket</p>
                  <p className="text-slate-300 font-semibold">{formatCurrency(event.revenue / event.tickets)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Organizer Payouts</p>
              <p className="text-white font-bold text-2xl">{formatCurrency(revenueStats.organizerPayouts)}</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs">90% of total revenue</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Stripe Fees</p>
              <p className="text-white font-bold text-2xl">{formatCurrency(revenueStats.stripeFees)}</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs">2.9% transaction fees</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Net Revenue</p>
              <p className="text-white font-bold text-2xl">{formatCurrency(revenueStats.netRevenue)}</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs">After all fees</p>
        </div>
      </div>
    </div>
  );
}