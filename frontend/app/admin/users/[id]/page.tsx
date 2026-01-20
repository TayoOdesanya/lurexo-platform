'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  ShoppingBag,
  Ticket,
  Heart,
  CreditCard,
  Activity,
  Ban,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Edit,
  MoreVertical,
} from 'lucide-react';
import { mockUserDetail } from '../../../../lib/mockData/adminStats';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'orders' | 'activity'>('overview');

  // In real app, fetch user by params.id
  const user = mockUserDetail;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
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

  const getOrderStatusBadge = (status: string) => {
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
      cancelled: {
        icon: <AlertCircle className="w-3 h-3" />,
        label: 'Cancelled',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        text: 'text-slate-400',
      },
      refunded: {
        icon: <Ban className="w-3 h-3" />,
        label: 'Refunded',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
      },
    };
    const config = configs[status as keyof typeof configs] || configs.completed;
    
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/users')}
          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            User Details
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            View and manage user information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all">
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-3xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  {user.emailVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-xs font-medium text-blue-400">
                      <Shield className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                  {user.isSuspended ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-500/10 border border-rose-500/30 rounded text-xs font-medium text-rose-400">
                      <Ban className="w-3 h-3" />
                      Suspended
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-medium text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">Joined {formatDate(user.joinedDate)}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    <p className="text-slate-400 text-xs">Total Orders</p>
                  </div>
                  <p className="text-white font-bold text-2xl">{user.orders.length}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Ticket className="w-4 h-4 text-purple-400" />
                    <p className="text-slate-400 text-xs">Tickets</p>
                  </div>
                  <p className="text-white font-bold text-2xl">{user.ticketsPurchased}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <p className="text-slate-400 text-xs">Total Spent</p>
                  </div>
                  <p className="text-emerald-400 font-bold text-2xl">{formatCurrency(user.totalSpent || 0)}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <p className="text-slate-400 text-xs">Favorites</p>
                  </div>
                  <p className="text-white font-bold text-2xl">{user.favoriteEvents.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-1 shadow-xl">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedTab === 'overview'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('orders')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedTab === 'orders'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orders ({user.orders.length})
          </button>
          <button
            onClick={() => setSelectedTab('activity')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              selectedTab === 'activity'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Security */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              Account Security
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-slate-300">Email Verified</span>
                {user.emailVerified ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-slate-300">Phone Verified</span>
                {user.phoneVerified ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-300">Two-Factor Auth</span>
                {user.twoFactorEnabled ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              Payment Methods
            </h3>
            <div className="space-y-3">
              {user.paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                      <CreditCard className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-slate-400 text-xs">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="text-xs px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Events */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6 lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              Favorite Events ({user.favoriteEvents.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.favoriteEvents.map((event) => (
                <div key={event.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <h4 className="text-white font-semibold mb-2">{event.name}</h4>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {selectedTab === 'orders' && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Event Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Purchased
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {user.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-800 px-2 py-1 rounded text-indigo-400 font-mono">
                        {order.id}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{order.eventName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300 text-sm">{formatDate(order.eventDate)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-white">{order.quantity}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-emerald-400 font-semibold">{formatCurrency(order.amount)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getOrderStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300 text-sm">{formatDate(order.purchasedAt)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-slate-700/30">
            {user.orders.map((order) => (
              <div key={order.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{order.eventName}</h4>
                    <code className="text-xs bg-slate-800 px-2 py-1 rounded text-indigo-400 font-mono">
                      {order.id}
                    </code>
                  </div>
                  {getOrderStatusBadge(order.status)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-slate-500 text-xs">Event Date</p>
                    <p className="text-white text-sm mt-1">{formatDate(order.eventDate)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Purchased</p>
                    <p className="text-white text-sm mt-1">{formatDate(order.purchasedAt)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Quantity</p>
                    <p className="text-white text-sm mt-1">{order.quantity} tickets</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Amount</p>
                    <p className="text-emerald-400 font-semibold text-sm mt-1">{formatCurrency(order.amount)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {selectedTab === 'activity' && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
          <div className="divide-y divide-slate-700/30">
            {user.activityLog.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30 flex-shrink-0">
                    <Activity className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="text-white font-semibold mb-1">{activity.action}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                          <span>{activity.device}</span>
                          <code className="bg-slate-800 px-2 py-1 rounded font-mono">
                            {activity.ipAddress}
                          </code>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-slate-400 text-xs">{formatDateTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}