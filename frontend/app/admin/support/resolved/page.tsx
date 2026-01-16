'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MessageSquare, 
  User,
  Clock,
  CheckCircle,
} from 'lucide-react';
import TicketStatusBadge from '../../../components/admin/TicketStatusBadge';
import PriorityBadge from '../../../components/admin/PriorityBadge';
import { mockResolvedTickets } from '../../../../lib/mockData/adminStats';

type CategoryFilter = 'all' | 'technical' | 'billing' | 'event' | 'account' | 'other';

export default function ResolvedTicketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  // Filter tickets
  const filteredTickets = mockResolvedTickets.filter((ticket) => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Resolved Tickets
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            {mockResolvedTickets.length} resolved ticket{mockResolvedTickets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/support"
          className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-white text-sm font-medium transition-all"
        >
          ← Back to All Tickets
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-5 border border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{mockResolvedTickets.length}</p>
            <p className="text-sm text-emerald-400">Successfully Resolved</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resolved tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Category Filter */}
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
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-12 border border-slate-700/50 text-center">
            <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No resolved tickets found</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/admin/support/${ticket.id}`}
              className="block group"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <PriorityBadge priority={ticket.priority} size="sm" />
                    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                      {getCategoryLabel(ticket.category)}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {ticket.ticketNumber}
                    </span>
                  </div>
                  <TicketStatusBadge status={ticket.status} size="sm" />
                </div>

                {/* Subject */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2 line-clamp-2">
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
                    <span className="text-xs">Resolved {ticket.resolvedAt && formatDate(ticket.resolvedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-xs">{ticket.messagesCount} msg</span>
                  </div>
                  {ticket.resolvedBy && (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span className="text-xs">by {ticket.resolvedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}