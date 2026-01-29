'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { mockAdminOrganizers } from '../../../lib/mockData/adminStats';

type StatusFilter = 'all' | 'verified' | 'pending' | 'unverified' | 'rejected';
type SortBy = 'name' | 'created' | 'revenue' | 'events';

export default function OrganizersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('created');

  // Filter organizers
  let filteredOrganizers = mockAdminOrganizers.filter((org) => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || org.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort organizers
  filteredOrganizers = [...filteredOrganizers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'revenue':
        return b.totalRevenue - a.totalRevenue;
      case 'events':
        return b.totalEvents - a.totalEvents;
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalOrganizers = mockAdminOrganizers.length;
  const verifiedCount = mockAdminOrganizers.filter(o => o.verificationStatus === 'verified').length;
  const pendingCount = mockAdminOrganizers.filter(o => o.verificationStatus === 'pending').length;
  const totalRevenue = mockAdminOrganizers.reduce((sum, o) => sum + o.totalRevenue, 0);
  const totalEvents = mockAdminOrganizers.reduce((sum, o) => sum + o.totalEvents, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      verified: {
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Verified',
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
      unverified: {
        icon: <AlertCircle className="w-3 h-3" />,
        label: 'Unverified',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        text: 'text-slate-400',
      },
      rejected: {
        icon: <XCircle className="w-3 h-3" />,
        label: 'Rejected',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
      },
    };
    const config = configs[status as keyof typeof configs] || configs.unverified;
    
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
            Organizers
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Manage event organizers and verification status
          </p>
        </div>
        <Link
          href="/admin/organizers/pending-verification"
          className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-medium transition-all"
        >
          Review Pending ({pendingCount})
        </Link>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalOrganizers}</p>
          <p className="text-xs text-slate-400 mt-1">Organizers</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">Verified</p>
          </div>
          <p className="text-2xl font-bold text-white">{verifiedCount}</p>
          <p className="text-xs text-slate-400 mt-1">Approved</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-amber-400 font-medium uppercase tracking-wide">Pending</p>
          </div>
          <p className="text-2xl font-bold text-white">{pendingCount}</p>
          <p className="text-xs text-slate-400 mt-1">Need review</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-blue-400 font-medium uppercase tracking-wide">Events</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalEvents}</p>
          <p className="text-xs text-slate-400 mt-1">Created</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-purple-400 font-medium uppercase tracking-wide">Revenue</p>
          </div>
          <p className="text-2xl font-bold text-white">£{(totalRevenue / 1000).toFixed(0)}k</p>
          <p className="text-xs text-slate-400 mt-1">Generated</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'all'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          All ({totalOrganizers})
        </button>
        <button
          onClick={() => setStatusFilter('verified')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'verified'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          <CheckCircle className="w-3 h-3 inline mr-1" />
          Verified ({verifiedCount})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'pending'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          <Clock className="w-3 h-3 inline mr-1" />
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter('unverified')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'unverified'
              ? 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-400 border border-slate-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Unverified
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'rejected'
              ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
        >
          <option value="created">Sort by Created</option>
          <option value="name">Sort by Name</option>
          <option value="revenue">Sort by Revenue</option>
          <option value="events">Sort by Events</option>
        </select>
      </div>

      {/* Results Count */}
      {(searchQuery || statusFilter !== 'all') && (
        <p className="text-sm text-slate-400">
          Showing {filteredOrganizers.length} of {totalOrganizers} organizers
        </p>
      )}

      {/* Organizers Table - Desktop */}
      <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        {filteredOrganizers.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No organizers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Organizer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Events
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredOrganizers.map((org) => (
                  <tr
                    key={org.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <Building2 className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{org.name}</p>
                          <p className="text-xs text-slate-400">{org.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(org.verificationStatus)}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-300">{formatDate(org.createdAt)}</p>
                      {org.verifiedAt && (
                        <p className="text-xs text-emerald-400 mt-0.5">
                          Verified {formatDate(org.verifiedAt)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-semibold text-white">{org.totalEvents}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-bold text-emerald-400">
                        £{org.totalRevenue.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Link
                        href={`/admin/organizers/${org.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-lg text-xs font-medium transition-all"
                      >
                        <Shield className="w-3 h-3" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Organizers Cards - Mobile */}
      <div className="lg:hidden space-y-3">
        {filteredOrganizers.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-12 border border-slate-700/50 text-center">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No organizers found</p>
          </div>
        ) : (
          filteredOrganizers.map((org) => (
            <Link
              key={org.id}
              href={`/admin/organizers/${org.id}`}
              className="block group"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <Building2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {org.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{org.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(org.verificationStatus)}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-slate-700/50">
                  <div>
                    <p className="text-xs text-slate-500">Joined</p>
                    <p className="text-sm font-medium text-white">{formatDate(org.createdAt)}</p>
                  </div>
                  {org.verifiedAt && (
                    <div>
                      <p className="text-xs text-slate-500">Verified</p>
                      <p className="text-sm font-medium text-emerald-400">{formatDate(org.verifiedAt)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-500">Events</p>
                    <p className="text-sm font-medium text-white">{org.totalEvents}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Revenue</p>
                    <p className="text-sm font-medium text-emerald-400">£{org.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}