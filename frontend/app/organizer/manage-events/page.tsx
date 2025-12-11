'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  Copy,
  MoreVertical,
  Users,
  Ticket,
  DollarSign,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
  Share2,
  Download,
  Mail,
  BarChart3,
  ArrowUpDown,
  X,
  Settings
} from 'lucide-react';

export default function ManageEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

  // Mock events data
  const events = [
    {
      id: 1,
      name: 'Summer Music Festival 2025',
      date: '2025-06-15',
      time: '18:00',
      venue: 'Hyde Park, London',
      status: 'on-sale',
      ticketsSold: 847,
      totalTickets: 1000,
      revenue: 42350,
      views: 12453,
      image: '/event-placeholder.jpg',
      category: 'Music',
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jazz Night Live',
      date: '2025-07-22',
      time: '20:00',
      venue: 'Ronnie Scott\'s, London',
      status: 'on-sale',
      ticketsSold: 124,
      totalTickets: 200,
      revenue: 6200,
      views: 3241,
      image: '/event-placeholder.jpg',
      category: 'Music',
      lastUpdated: '1 day ago'
    },
    {
      id: 3,
      name: 'Comedy Special - Sarah Johnson',
      date: '2025-08-10',
      time: '19:30',
      venue: 'The Comedy Store, London',
      status: 'draft',
      ticketsSold: 0,
      totalTickets: 150,
      revenue: 0,
      views: 0,
      image: '/event-placeholder.jpg',
      category: 'Comedy',
      lastUpdated: '3 days ago'
    },
    {
      id: 4,
      name: 'Tech Conference 2025',
      date: '2025-05-20',
      time: '09:00',
      venue: 'ExCeL London',
      status: 'sold-out',
      ticketsSold: 500,
      totalTickets: 500,
      revenue: 45000,
      views: 28934,
      image: '/event-placeholder.jpg',
      category: 'Conference',
      lastUpdated: '1 week ago'
    },
    {
      id: 5,
      name: 'Food & Wine Festival',
      date: '2025-09-05',
      time: '12:00',
      venue: 'Southbank Centre, London',
      status: 'paused',
      ticketsSold: 234,
      totalTickets: 800,
      revenue: 11700,
      views: 5643,
      image: '/event-placeholder.jpg',
      category: 'Food & Drink',
      lastUpdated: '2 days ago'
    },
    {
      id: 6,
      name: 'Art Exhibition Opening',
      date: '2025-04-15',
      time: '18:00',
      venue: 'Tate Modern, London',
      status: 'ended',
      ticketsSold: 320,
      totalTickets: 350,
      revenue: 9600,
      views: 7234,
      image: '/event-placeholder.jpg',
      category: 'Arts',
      lastUpdated: '2 weeks ago'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-sale':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            On Sale
          </span>
        );
      case 'draft':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs font-semibold">
            <Edit className="w-3 h-3" />
            Draft
          </span>
        );
      case 'sold-out':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
            <Ticket className="w-3 h-3" />
            Sold Out
          </span>
        );
      case 'paused':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold">
            <Pause className="w-3 h-3" />
            Paused
          </span>
        );
      case 'ended':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-500 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Ended
          </span>
        );
      default:
        return null;
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleEventSelection = (eventId: number) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on events:`, selectedEvents);
    // Implement bulk actions here
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">
                Manage Events
              </h1>
              <p className="text-gray-400 text-sm">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </p>
            </div>
            <Link href="/organizer/create-event">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-lg">
                <Plus className="w-5 h-5" />
                Create New Event
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by name or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors ${
                  showFilters
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="px-4 py-3 bg-gray-800 text-gray-400 hover:text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-colors">
                <ArrowUpDown className="w-4 h-4" />
                Sort
              </button>
            </div>
          </div>

          {/* Filter chips */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {['all', 'on-sale', 'draft', 'sold-out', 'paused', 'ended'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {status === 'all' ? 'All Events' : status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bulk actions */}
          {selectedEvents.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('pause')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => setSelectedEvents([])}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => toggleEventSelection(event.id)}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900 cursor-pointer mt-1"
                  />
                </div>

                {/* Event Image */}
                <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-12 h-12 text-purple-400" />
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-bold text-lg truncate">
                          {event.name}
                        </h3>
                        {getStatusBadge(event.status)}
                      </div>
                      <div className="flex flex-wrap gap-3 text-gray-400 text-sm mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.venue}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">
                        Last updated {event.lastUpdated}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Ticket className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400 text-xs">Sold</span>
                      </div>
                      <p className="text-white font-bold">
                        {event.ticketsSold}/{event.totalTickets}
                      </p>
                      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                          style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 text-xs">Revenue</span>
                      </div>
                      <p className="text-white font-bold">
                        £{event.revenue.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400 text-xs">Views</span>
                      </div>
                      <p className="text-white font-bold">
                        {event.views.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-400 text-xs">Category</span>
                      </div>
                      <p className="text-white font-bold text-sm">
                        {event.category}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/organizer/manage-events/${event.id}/edit`}>
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit Event
                      </button>
                    </Link>
                    <Link href={`/events/${event.id}`}>
                      <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </Link>
                    <Link href={`/organizer/analytics/${event.id}`}>
                      <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                      </button>
                    </Link>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">No events found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first event'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Link href="/organizer/create-event">
                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-colors">
                    <Plus className="w-5 h-5" />
                    Create Your First Event
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}