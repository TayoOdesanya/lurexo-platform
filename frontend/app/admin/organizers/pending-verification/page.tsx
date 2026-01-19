'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Building2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  Mail,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { mockPendingOrganizers } from '../../../../lib/mockData/adminStats';

type SortBy = 'submitted' | 'name' | 'documents';

export default function PendingVerificationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('submitted');

  // Filter organizers
  let filteredOrganizers = mockPendingOrganizers.filter((org) => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Sort organizers
  filteredOrganizers = [...filteredOrganizers].sort((a, b) => {
    switch (sortBy) {
      case 'submitted':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Oldest first
      case 'name':
        return a.name.localeCompare(b.name);
      case 'documents':
        const aHasDocs = a.documentsSubmitted ? 1 : 0;
        const bHasDocs = b.documentsSubmitted ? 1 : 0;
        return bHasDocs - aHasDocs;
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeWaiting = (dateString: string) => {
    const submitted = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - submitted.getTime();
    
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 24) return `${hours}h waiting`;
    if (days === 1) return '1 day waiting';
    return `${days} days waiting`;
  };

  const getPriorityLevel = (dateString: string) => {
    const submitted = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now.getTime() - submitted.getTime()) / 86400000);
    
    if (days >= 3) return { level: 'urgent', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
    if (days >= 2) return { level: 'high', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { level: 'normal', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Pending Verification
            </h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base">
            Review and approve organizer verification requests
          </p>
        </div>
        <Link
          href="/admin/organizers"
          className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-white text-sm font-medium transition-all"
        >
          All Organizers
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-5 border border-amber-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Pending</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{mockPendingOrganizers.length}</p>
          <p className="text-xs text-slate-400 mt-2">Awaiting review</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-xl p-5 border border-rose-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-rose-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Urgent</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            {mockPendingOrganizers.filter(o => {
              const days = Math.floor((new Date().getTime() - new Date(o.createdAt).getTime()) / 86400000);
              return days >= 3;
            }).length}
          </p>
          <p className="text-xs text-slate-400 mt-2">Waiting 3+ days</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-5 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">With Docs</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            {mockPendingOrganizers.filter(o => o.documentsSubmitted).length}
          </p>
          <p className="text-xs text-slate-400 mt-2">Documents ready</p>
        </div>
      </div>

      {/* Priority Alert */}
      {mockPendingOrganizers.some(o => {
        const days = Math.floor((new Date().getTime() - new Date(o.createdAt).getTime()) / 86400000);
        return days >= 3;
      }) && (
        <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">
                Urgent verifications require attention
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Some organizers have been waiting 3+ days for verification review
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search pending organizers..."
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
          <option value="submitted">Sort by Oldest First</option>
          <option value="name">Sort by Name</option>
          <option value="documents">Sort by Documents</option>
        </select>
      </div>

      {/* Organizers Table - Desktop */}
      <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        {filteredOrganizers.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <p className="text-slate-400">No pending verifications</p>
            <p className="text-sm text-slate-500 mt-2">All organizers have been reviewed!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Organizer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Submitted
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Waiting Time
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Documents
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredOrganizers.map((org) => {
                  const priority = getPriorityLevel(org.createdAt);
                  return (
                    <tr
                      key={org.id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${priority.bg} ${priority.border}`}>
                          <AlertTriangle className={`w-3 h-3 ${priority.color}`} />
                          <span className={`text-xs font-medium ${priority.color}`}>
                            {priority.level.toUpperCase()}
                          </span>
                        </div>
                      </td>
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
                        <p className="text-sm text-slate-300">{formatDate(org.createdAt)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className={`text-sm font-medium ${priority.color}`}>
                          {getTimeWaiting(org.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {org.documentsSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-medium text-emerald-400">
                            <CheckCircle className="w-3 h-3" />
                            Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-500/10 border border-slate-500/30 rounded text-xs font-medium text-slate-400">
                            <XCircle className="w-3 h-3" />
                            Missing
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Link
                          href={`/admin/organizers/${org.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-lg text-xs font-medium transition-all"
                        >
                          <Shield className="w-3 h-3" />
                          Review
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Organizers Cards - Mobile */}
      <div className="lg:hidden space-y-3">
        {filteredOrganizers.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-12 border border-slate-700/50 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <p className="text-slate-400">No pending verifications</p>
            <p className="text-sm text-slate-500 mt-2">All organizers have been reviewed!</p>
          </div>
        ) : (
          filteredOrganizers.map((org) => {
            const priority = getPriorityLevel(org.createdAt);
            return (
              <Link
                key={org.id}
                href={`/admin/organizers/${org.id}`}
                className="block group"
              >
                <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border transition-all duration-300 shadow-lg ${
                  priority.level === 'urgent' 
                    ? 'border-rose-500/30 hover:border-rose-500/50'
                    : 'border-slate-700/50 hover:border-indigo-500/50'
                }`}>
                  
                  {/* Priority Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${priority.bg} ${priority.border}`}>
                      <AlertTriangle className={`w-3 h-3 ${priority.color}`} />
                      <span className={`text-xs font-medium ${priority.color}`}>
                        {priority.level.toUpperCase()}
                      </span>
                    </div>
                    {org.documentsSubmitted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-medium text-emerald-400">
                        <FileText className="w-3 h-3" />
                        Docs Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-500/10 border border-slate-500/30 rounded text-xs font-medium text-slate-400">
                        <XCircle className="w-3 h-3" />
                        No Docs
                      </span>
                    )}
                  </div>

                  {/* Organizer Info */}
                  <div className="flex items-center gap-3 mb-3">
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

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/50">
                    <div>
                      <p className="text-xs text-slate-500">Submitted</p>
                      <p className="text-sm font-medium text-white">{formatDate(org.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Waiting</p>
                      <p className={`text-sm font-medium ${priority.color}`}>
                        {getTimeWaiting(org.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Action Hint */}
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <p className="text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                      <Shield className="w-3 h-3" />
                      Review verification
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}