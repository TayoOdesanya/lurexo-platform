'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  UserPlus,
  Upload,
  Search,
  Download,
  Send,
  Mail,
  Phone,
  QrCode,
  Link2,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  X,
  Check,
  AlertCircle,
  Users,
  Copy,
  ExternalLink,
  Edit,
} from 'lucide-react';

// Mock Guest Type
interface Guest {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  category: 'VIP' | 'INDUSTRY' | 'COMP' | 'STAFF' | 'PRESS' | 'SPONSOR';
  status: 'INVITED' | 'CONFIRMED' | 'DECLINED' | 'CHECKED_IN';
  ticketCode: string;
  ticketLink: string;
  notes?: string;
  createdAt: string;
}

interface CreateGuestData {
  name: string;
  email: string;
  mobile?: string;
  category: string;
  notes?: string;
}

// Mock data generator
const generateMockGuests = (): Guest[] => {
  return [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      mobile: '+44 7123 456789',
      category: 'VIP',
      status: 'CONFIRMED',
      ticketCode: 'VIP-2025-001',
      ticketLink: 'https://lurexo.com/tickets/vip-2025-001',
      notes: 'Table near stage',
      createdAt: '2025-01-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Marcus Chen',
      email: 'marcus@musiclabel.com',
      mobile: '+44 7234 567890',
      category: 'INDUSTRY',
      status: 'CONFIRMED',
      ticketCode: 'IND-2025-002',
      ticketLink: 'https://lurexo.com/tickets/ind-2025-002',
      createdAt: '2025-01-16T14:20:00Z',
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma.wilson@press.co.uk',
      category: 'PRESS',
      status: 'INVITED',
      ticketCode: 'PRS-2025-003',
      ticketLink: 'https://lurexo.com/tickets/prs-2025-003',
      notes: 'Photographer - needs backstage access',
      createdAt: '2025-01-17T09:15:00Z',
    },
    {
      id: '4',
      name: 'James Rodriguez',
      email: 'james.r@sponsor.com',
      mobile: '+44 7345 678901',
      category: 'SPONSOR',
      status: 'CONFIRMED',
      ticketCode: 'SPO-2025-004',
      ticketLink: 'https://lurexo.com/tickets/spo-2025-004',
      notes: 'Brand partnership manager',
      createdAt: '2025-01-17T11:45:00Z',
    },
    {
      id: '5',
      name: 'Olivia Brown',
      email: 'olivia@venue.com',
      mobile: '+44 7456 789012',
      category: 'STAFF',
      status: 'CHECKED_IN',
      ticketCode: 'STF-2025-005',
      ticketLink: 'https://lurexo.com/tickets/stf-2025-005',
      createdAt: '2025-01-18T08:00:00Z',
    },
    {
      id: '6',
      name: 'David Martinez',
      email: 'david.m@example.com',
      category: 'COMP',
      status: 'INVITED',
      ticketCode: 'CMP-2025-006',
      ticketLink: 'https://lurexo.com/tickets/cmp-2025-006',
      notes: 'Artist friend',
      createdAt: '2025-01-18T13:30:00Z',
    },
    {
      id: '7',
      name: 'Sophie Anderson',
      email: 'sophie@radio.com',
      mobile: '+44 7567 890123',
      category: 'PRESS',
      status: 'DECLINED',
      ticketCode: 'PRS-2025-007',
      ticketLink: 'https://lurexo.com/tickets/prs-2025-007',
      createdAt: '2025-01-18T16:00:00Z',
    },
    {
      id: '8',
      name: 'Michael Lee',
      email: 'michael.lee@vip.com',
      mobile: '+44 7678 901234',
      category: 'VIP',
      status: 'CONFIRMED',
      ticketCode: 'VIP-2025-008',
      ticketLink: 'https://lurexo.com/tickets/vip-2025-008',
      notes: 'VIP lounge access',
      createdAt: '2025-01-19T10:00:00Z',
    },
  ];
};

export default function GuestListManagementPage() {
  const params = useParams();
  const eventId = (params?.eventId as string) || 'dev-event-123';

  // State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxGuests] = useState<number>(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showGuestDetail, setShowGuestDetail] = useState<Guest | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Add guest form
  const [newGuest, setNewGuest] = useState<CreateGuestData>({
    name: '',
    email: '',
    mobile: '',
    category: 'VIP',
    notes: '',
  });

  // Mock event data
  const event = {
    id: eventId,
    name: 'Summer Music Festival 2025',
    date: '2025-06-15',
  };

  const categories = ['VIP', 'INDUSTRY', 'COMP', 'STAFF', 'PRESS', 'SPONSOR'];

  // Load mock data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGuests(generateMockGuests());
      setLoading(false);
    }, 800);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'INVITED':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Invited
          </span>
        );
      case 'DECLINED':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Declined
          </span>
        );
      case 'CHECKED_IN':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
            <Check className="w-3 h-3" />
            Checked In
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      VIP: 'bg-yellow-500/20 text-yellow-400',
      INDUSTRY: 'bg-blue-500/20 text-blue-400',
      COMP: 'bg-purple-500/20 text-purple-400',
      STAFF: 'bg-green-500/20 text-green-400',
      PRESS: 'bg-pink-500/20 text-pink-400',
      SPONSOR: 'bg-orange-500/20 text-orange-400',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guest.mobile && guest.mobile.includes(searchQuery));
    const matchesCategory = categoryFilter === 'all' || guest.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddGuest = async () => {
    if (!newGuest.name || !newGuest.email) {
      alert('Name and email are required');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const guestNumber = guests.length + 1;
      const categoryCode = newGuest.category.substring(0, 3).toUpperCase();
      const guest: Guest = {
        id: String(guests.length + 1),
        name: newGuest.name,
        email: newGuest.email,
        mobile: newGuest.mobile,
        category: newGuest.category as any,
        status: 'INVITED',
        ticketCode: `${categoryCode}-2025-${String(guestNumber).padStart(3, '0')}`,
        ticketLink: `https://lurexo.com/tickets/${categoryCode.toLowerCase()}-2025-${String(guestNumber).padStart(3, '0')}`,
        notes: newGuest.notes,
        createdAt: new Date().toISOString(),
      };

      setGuests([guest, ...guests]);
      setNewGuest({ name: '', email: '', mobile: '', category: 'VIP', notes: '' });
      setShowAddModal(false);
      setSubmitting(false);
      alert('Guest added successfully!');
    }, 500);
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Are you sure you want to remove this guest?')) {
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setGuests(guests.filter((g) => g.id !== guestId));
      alert('Guest removed successfully!');
    }, 300);
  };

  const handleBulkImport = () => {
    if (!csvFile) {
      alert('Please select a CSV file');
      return;
    }

    alert(`Importing guests from ${csvFile.name} (dev mode - not implemented)`);
    setShowBulkImportModal(false);
    setCsvFile(null);
  };

  const handleSendInvitation = async (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId);
    if (guest) {
      alert(`Invitation sent to ${guest.email}!`);
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Mobile', 'Category', 'Status', 'Ticket Code', 'Ticket Link', 'Notes'];
    const csv = [
      headers.join(','),
      ...filteredGuests.map((guest) =>
        [
          guest.name,
          guest.email,
          guest.mobile || '',
          guest.category,
          guest.status,
          guest.ticketCode,
          guest.ticketLink,
          guest.notes || '',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-list-${event.name.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const usedGuests = guests.length;
  const remainingGuests = maxGuests - usedGuests;
  const utilizationPercent = (usedGuests / maxGuests) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading guest list...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-xl mb-2">Error Loading Guest List</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dev Mode Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-blue-300 font-medium text-xs">Development Mode - Using mock data</p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/organizer/manage-events"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Events
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">{event.name}</h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Guest List Management - {usedGuests} {usedGuests === 1 ? 'guest' : 'guests'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/organizer/manage-events/${eventId}/edit`}>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors">
                  <Edit className="w-5 h-5" />
                  Edit Event
                </button>
              </Link>
              <button
                onClick={() => setShowBulkImportModal(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Bulk Import
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                Add Guest
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Guest Allocation Stats */}
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-gray-400 text-sm font-medium">Total Guests</span>
                </div>
                <p className="text-white font-bold text-2xl mb-2">
                  {usedGuests} / {maxGuests}
                </p>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all"
                    style={{ width: `${utilizationPercent}%` }}
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">{remainingGuests} remaining</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-gray-400 text-sm font-medium">Confirmed</span>
                </div>
                <p className="text-white font-bold text-2xl">
                  {guests.filter((g) => g.status === 'CONFIRMED').length}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-gray-400 text-sm font-medium">Pending</span>
                </div>
                <p className="text-white font-bold text-2xl">
                  {guests.filter((g) => g.status === 'INVITED').length}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors font-medium text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors font-medium text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="INVITED">Invited</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="DECLINED">Declined</option>
                  <option value="CHECKED_IN">Checked In</option>
                </select>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Guest List Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/50">
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Guest</th>
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Contact</th>
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Category</th>
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Status</th>
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Ticket</th>
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="text-white font-semibold">{guest.name}</p>
                          {guest.notes && <p className="text-gray-500 text-xs mt-1 line-clamp-1">{guest.notes}</p>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{guest.email}</span>
                          </div>
                          {guest.mobile && (
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              {guest.mobile}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getCategoryColor(
                            guest.category
                          )}`}
                        >
                          {guest.category}
                        </span>
                      </td>
                      <td className="p-4">{getStatusBadge(guest.status)}</td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-white text-sm font-mono">{guest.ticketCode}</p>
                          <button
                            onClick={() => handleCopyLink(guest.ticketLink)}
                            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs transition-colors"
                          >
                            <Link2 className="w-3 h-3" />
                            Copy Link
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {guest.status === 'INVITED' && (
                            <button
                              onClick={() => handleSendInvitation(guest.id)}
                              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                              title="Send Invitation"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setShowGuestDetail(guest)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            title="View Details"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGuest(guest.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
                            title="Delete Guest"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredGuests.length === 0 && (
              <div className="text-center py-12 px-4">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'No guests found'
                    : 'No guests added yet'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by adding your first guest to the list'}
                </p>
                {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Your First Guest
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Add Guest Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-white font-bold text-xl">Add Guest</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Name *</label>
                    <input
                      type="text"
                      value={newGuest.name}
                      onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                      placeholder="e.g., John Doe"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Email *</label>
                    <input
                      type="email"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Mobile (Optional)</label>
                    <input
                      type="tel"
                      value={newGuest.mobile}
                      onChange={(e) => setNewGuest({ ...newGuest, mobile: e.target.value })}
                      placeholder="+44 7123456789"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Category</label>
                    <select
                      value={newGuest.category}
                      onChange={(e) => setNewGuest({ ...newGuest, category: e.target.value as any })}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Notes (Optional)</label>
                    <textarea
                      value={newGuest.notes}
                      onChange={(e) => setNewGuest({ ...newGuest, notes: e.target.value })}
                      placeholder="Any special requirements or notes..."
                      rows={3}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={() => setShowAddModal(false)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddGuest}
                      disabled={!newGuest.name || !newGuest.email || submitting}
                      className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Adding...' : 'Add Guest'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Import Modal */}
          {showBulkImportModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-white font-bold text-xl">Bulk Import Guests</h2>
                  <button
                    onClick={() => setShowBulkImportModal(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl p-8 text-center transition-colors">
                      {csvFile ? (
                        <div>
                          <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
                          <p className="text-white font-medium mb-2">{csvFile.name}</p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setCsvFile(null);
                            }}
                            className="text-red-400 hover:text-red-300 text-sm transition-colors"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                          <p className="text-white font-medium mb-2">Click to upload CSV</p>
                          <p className="text-gray-400 text-sm">or drag and drop</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-300 font-medium text-sm mb-1">CSV Format</p>
                        <p className="text-blue-200/80 text-xs">
                          Include columns: Name, Email, Mobile, Category, Notes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={() => setShowBulkImportModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkImport}
                      disabled={!csvFile}
                      className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Import
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guest Detail Modal */}
          {showGuestDetail && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-white font-bold text-xl">Guest Ticket</h2>
                  <button
                    onClick={() => setShowGuestDetail(null)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Guest Info */}
                  <div>
                    <p className="text-white font-bold text-lg">{showGuestDetail.name}</p>
                    <p className="text-gray-400 text-sm">{showGuestDetail.email}</p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        showGuestDetail.category
                      )}`}
                    >
                      {showGuestDetail.category}
                    </span>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="bg-white p-8 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-32 h-32 text-gray-800 mx-auto mb-4" />
                      <p className="text-gray-600 font-mono text-sm">{showGuestDetail.ticketCode}</p>
                    </div>
                  </div>

                  {/* Ticket Link */}
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Ticket Link</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={showGuestDetail.ticketLink}
                        readOnly
                        className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 text-sm font-mono"
                      />
                      <button
                        onClick={() => handleCopyLink(showGuestDetail.ticketLink)}
                        className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.open(showGuestDetail.ticketLink, '_blank')}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Ticket
                    </button>
                    {showGuestDetail.status === 'INVITED' && (
                      <button
                        onClick={() => handleSendInvitation(showGuestDetail.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Send Invite
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}