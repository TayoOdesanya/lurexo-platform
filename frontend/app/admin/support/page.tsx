'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MessageSquare, 
  User,
  Clock,
  Mail,
  LayoutGrid,
  List,
  AlertCircle,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import TicketStatusBadge from '../../components/admin/TicketStatusBadge';
import PriorityBadge from '../../components/admin/PriorityBadge';
import { mockSupportTickets } from '../../../lib/mockData/adminStats';

type StatusFilter = 'all' | 'open' | 'in_progress' | 'waiting_response' | 'resolved';
type PriorityFilter = 'all' | 'low' | 'medium' | 'high' | 'urgent';
type CategoryFilter = 'all' | 'technical' | 'billing' | 'event' | 'account' | 'other';
type ViewMode = 'table' | 'cards';

export default function SupportTicketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Filter tickets
  const filteredTickets = mockSupportTickets.filter((ticket) => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Count tickets by status
  const openCount = mockSupportTickets.filter(t => t.status === 'open').length;
  const inProgressCount = mockSupportTickets.filter(t => t.status === 'in_progress').length;
  const waitingCount = mockSupportTickets.filter(t => t.status === 'waiting_response').length;
  const resolvedCount = mockSupportTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const urgentCount = mockSupportTickets.filter(t => t.priority === 'urgent' && (t.status !== 'resolved' && t.status !== 'closed')).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'billing':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'event':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'account':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Support Tickets
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Manage and respond to customer support requests
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total</p>
          </div>
          <p className="text-2xl font-bold text-white">{mockSupportTickets.length}</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-xl p-4 border border-rose-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <p className="text-xs text-rose-400 font-medium uppercase tracking-wide">Open</p>
          </div>
          <p className="text-2xl font-bold text-white">{openCount}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide">In Progress</p>
          </div>
          <p className="text-2xl font-bold text-white">{inProgressCount}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-amber-400 font-medium uppercase tracking-wide">Waiting</p>
          </div>
          <p className="text-2xl font-bold text-white">{waitingCount}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">Resolved</p>
          </div>
          <p className="text-2xl font-bold text-white">{resolvedCount}</p>
        </div>
      </div>

      {/* Urgent Tickets Alert */}
      {urgentCount > 0 && (
        <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <p className="text-sm text-rose-400 font-medium">
              <strong>{urgentCount}</strong> urgent ticket{urgentCount !== 1 ? 's' : ''} require{urgentCount === 1 ? 's' : ''} immediate attention
            </p>
          </div>
        </div>
      )}

      {/* Filters & Controls */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket number, subject, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_response">Waiting</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
          >
            <option value="all">All Categories</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="event">Event</option>
            <option value="account">Account</option>
            <option value="other">Other</option>
          </select>

          {/* View Toggle - Desktop Only */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' ? (
        <p className="text-sm text-slate-400">
          Showing {filteredTickets.length} of {mockSupportTickets.length} tickets
        </p>
      ) : null}

      {/* TABLE VIEW - Desktop */}
      {viewMode === 'table' && (
        <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No tickets found</p>
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
                      Ticket
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Updated
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Messages
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        ticket.priority === 'urgent' ? 'bg-rose-500/5' : ''
                      }`}
                      onClick={() => window.location.href = `/admin/support/${ticket.id}`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPriorityEmoji(ticket.priority)}</span>
                          <PriorityBadge priority={ticket.priority} size="sm" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-white hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            {ticket.ticketNumber}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">{ticket.userName}</p>
                          <p className="text-xs text-slate-400">{ticket.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded border text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                          {getCategoryLabel(ticket.category)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <TicketStatusBadge status={ticket.status} size="sm" />
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-300">{formatDate(ticket.updatedAt)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">{ticket.messagesCount}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CARD VIEW - Desktop (when toggled) + Mobile (always) */}
      {(viewMode === 'cards' || true) && (
        <div className={viewMode === 'table' ? 'lg:hidden' : ''}>
          <div className="space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-12 border border-slate-700/50 text-center">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No tickets found</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/admin/support/${ticket.id}`}
                  className="block group"
                >
                  <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 ${
                    ticket.priority === 'urgent'
                      ? 'border-rose-500/30 hover:border-rose-500/50 bg-gradient-to-br from-rose-500/5 to-slate-800'
                      : 'border-slate-700/50 hover:border-indigo-500/50'
                  }`}>
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getPriorityEmoji(ticket.priority)}</span>
                        <PriorityBadge priority={ticket.priority} size="sm" />
                        <span className={`px-2 py-0.5 rounded border text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                          {getCategoryLabel(ticket.category)}
                        </span>
                      </div>
                      <TicketStatusBadge status={ticket.status} size="sm" />
                    </div>

                    {/* Subject */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2">
                      {ticket.subject}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span className="text-xs">{ticket.userName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatDate(ticket.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-xs">{ticket.messagesCount} msg</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">{ticket.ticketNumber}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}