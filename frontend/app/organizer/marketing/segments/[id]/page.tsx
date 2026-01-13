'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Send,
  Download,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Tag,
  MoreVertical,
  X,
  CheckCircle,
  AlertCircle,
  Upload,
} from 'lucide-react';

interface Fan {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  category: 'guest-list' | 'family' | 'vip' | 'general' | 'press' | 'industry';
  location: string;
  totalSpend: number;
  eventsAttended: number;
  lastActive: string;
  joinedDate: string;
}

interface Campaign {
  id: string;
  name: string;
  sentAt: string;
  recipients: number;
  opened: number;
  clicked: number;
  revenue: number;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  type: 'auto' | 'custom';
  memberCount: number;
  engagement: number;
  createdAt: string;
  updatedAt: string;
}

export default function SegmentDetailPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFans, setSelectedFans] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fansPerPage = 50;

  // Mock segment data
  const segment: Segment = {
  id: '1',
  name: 'VIP Fans (Top 10%)',
  description: 'Your most engaged fans by spend and attendance',
  type: 'auto',
  memberCount: 1250,
  engagement: 85,
  createdAt: '2024-11-01T00:00:00Z',
  updatedAt: '2024-12-10T00:00:00Z',
};

  // Mock growth data (last 6 months)
  const growthData = [
    { month: 'Jul', members: 890 },
    { month: 'Aug', members: 950 },
    { month: 'Sep', members: 1020 },
    { month: 'Oct', members: 1100 },
    { month: 'Nov', members: 1180 },
    { month: 'Dec', members: 1250 },
  ];

  // Mock campaign history
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'VIP Pre-Sale Access',
      sentAt: '2024-12-08T10:00:00Z',
      recipients: 1250,
      opened: 890,
      clicked: 420,
      revenue: 13500,
    },
    {
      id: '2',
      name: 'Exclusive Merch Drop',
      sentAt: '2024-11-22T14:30:00Z',
      recipients: 1180,
      opened: 756,
      clicked: 365,
      revenue: 8200,
    },
    {
      id: '3',
      name: 'VIP Thank You',
      sentAt: '2024-11-10T12:00:00Z',
      recipients: 1100,
      opened: 825,
      clicked: 198,
      revenue: 0,
    },
  ];

  // Mock fans data
  const allFans: Fan[] = Array.from({ length: 1250 }, (_, i) => ({
    id: `fan_${i + 1}`,
    name: `Fan ${i + 1}`,
    email: `fan${i + 1}@example.com`,
    mobile: Math.random() > 0.3 ? `+44 7${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}` : undefined,
    category: ['vip', 'family', 'guest-list', 'general', 'press', 'industry'][Math.floor(Math.random() * 6)] as any,
    location: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol'][Math.floor(Math.random() * 5)],
    totalSpend: Math.floor(Math.random() * 2000) + 500,
    eventsAttended: Math.floor(Math.random() * 15) + 5,
    lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  // Export options
  const [exportOptions, setExportOptions] = useState({
    name: true,
    email: true,
    mobile: true,
    category: true,
    location: true,
    totalSpend: true,
    eventsAttended: true,
    lastActive: true,
    joinedDate: true,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      'vip': 'bg-yellow-500/20 text-yellow-400',
      'family': 'bg-pink-500/20 text-pink-400',
      'guest-list': 'bg-purple-500/20 text-purple-400',
      'general': 'bg-gray-500/20 text-gray-400',
      'press': 'bg-blue-500/20 text-blue-400',
      'industry': 'bg-green-500/20 text-green-400',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[category as keyof typeof styles] || styles.general}`}>
        {category.replace('-', ' ')}
      </span>
    );
  };

  // Filter fans
  const filteredFans = allFans.filter(fan => {
    const matchesSearch = fan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fan.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (fan.mobile && fan.mobile.includes(searchQuery));
    const matchesCategory = categoryFilter === 'all' || fan.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredFans.length / fansPerPage);
  const startIndex = (currentPage - 1) * fansPerPage;
  const paginatedFans = filteredFans.slice(startIndex, startIndex + fansPerPage);

  const toggleFanSelection = (fanId: string) => {
    setSelectedFans(prev =>
      prev.includes(fanId) ? prev.filter(id => id !== fanId) : [...prev, fanId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFans.length === paginatedFans.length) {
      setSelectedFans([]);
    } else {
      setSelectedFans(paginatedFans.map(f => f.id));
    }
  };

  const handleExport = () => {
    // Generate CSV based on selected options
    const headers = [];
    if (exportOptions.name) headers.push('Name');
    if (exportOptions.email) headers.push('Email');
    if (exportOptions.mobile) headers.push('Mobile');
    if (exportOptions.category) headers.push('Category');
    if (exportOptions.location) headers.push('Location');
    if (exportOptions.totalSpend) headers.push('Total Spend');
    if (exportOptions.eventsAttended) headers.push('Events Attended');
    if (exportOptions.lastActive) headers.push('Last Active');
    if (exportOptions.joinedDate) headers.push('Joined Date');

    const csv = [
      headers.join(','),
      ...filteredFans.map(fan => {
        const row = [];
        if (exportOptions.name) row.push(fan.name);
        if (exportOptions.email) row.push(fan.email);
        if (exportOptions.mobile) row.push(fan.mobile || '');
        if (exportOptions.category) row.push(fan.category);
        if (exportOptions.location) row.push(fan.location);
        if (exportOptions.totalSpend) row.push(fan.totalSpend);
        if (exportOptions.eventsAttended) row.push(fan.eventsAttended);
        if (exportOptions.lastActive) row.push(formatDate(fan.lastActive));
        if (exportOptions.joinedDate) row.push(formatDate(fan.joinedDate));
        return row.join(',');
      })
    ].join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${segment.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex-1">
          <Link
            href="/organizer/marketing/segments"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-2 transition-colors"
          >
            ← Back to Segments
          </Link>
          <h1 className="text-white font-bold text-2xl sm:text-3xl">{segment.name}</h1>
          <p className="text-gray-400 mt-1">{segment.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
              Auto-Generated
            </span>
            <span className="text-gray-500 text-sm">
              Created {formatDate(segment.createdAt)}
            </span>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/organizer/marketing/campaigns/new?segment=${segment.id}`}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-colors text-sm"
          >
            <Send className="w-4 h-4" />
            Send Campaign
          </Link>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            Export
          </button>
          
          {segment.type === 'custom' && (
            <>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors text-sm">
                <Edit className="w-4 h-4" />
                Edit Filters
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-semibold transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Members</p>
          <p className="text-white font-bold text-3xl">{segment.memberCount.toLocaleString()}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Engagement Rate</p>
          <p className="text-white font-bold text-3xl">{segment.engagement}%</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Send className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Campaigns Sent</p>
          <p className="text-white font-bold text-3xl">{campaigns.length}</p>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Segment Growth (Last 6 Months)
        </h3>
        <div className="space-y-3">
          {growthData.map((data, index) => {
            const maxMembers = Math.max(...growthData.map(d => d.members));
            const percentage = (data.members / maxMembers) * 100;
            const growth = index > 0 ? ((data.members - growthData[index - 1].members) / growthData[index - 1].members) * 100 : 0;

            return (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400 text-sm">{data.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm font-medium">{data.members.toLocaleString()} members</span>
                    {index > 0 && (
                      <span className={`text-xs font-medium ${growth > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        {growth > 0 && '+'}{growth.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-300 group-hover:from-purple-500 group-hover:to-blue-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaign History */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Campaign History
        </h3>
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Link
                    href={`/organizer/marketing/campaigns/${campaign.id}`}
                    className="text-white font-semibold hover:text-purple-400 transition-colors"
                  >
                    {campaign.name}
                  </Link>
                  <p className="text-gray-400 text-sm mt-1">
                    Sent {formatDate(campaign.sentAt)} to {campaign.recipients.toLocaleString()} fans
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Eye className="w-3 h-3 text-blue-400" />
                    <p className="text-xs text-gray-400">Opens</p>
                  </div>
                  <p className="text-white font-semibold">{campaign.opened.toLocaleString()}</p>
                  <p className="text-blue-400 text-xs">{((campaign.opened / campaign.recipients) * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <MousePointer className="w-3 h-3 text-green-400" />
                    <p className="text-xs text-gray-400">Clicks</p>
                  </div>
                  <p className="text-white font-semibold">{campaign.clicked.toLocaleString()}</p>
                  <p className="text-green-400 text-xs">{((campaign.clicked / campaign.opened) * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <DollarSign className="w-3 h-3 text-yellow-400" />
                    <p className="text-xs text-gray-400">Revenue</p>
                  </div>
                  <p className="text-white font-semibold">£{(campaign.revenue / 1000).toFixed(1)}k</p>
                </div>
                <div className="flex items-end">
                  <Link
                    href={`/organizer/marketing/campaigns/${campaign.id}`}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fan List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Fan List ({filteredFans.length.toLocaleString()})
        </h3>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white pl-12 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="all">All Categories</option>
            <option value="vip">VIP</option>
            <option value="family">Family</option>
            <option value="guest-list">Guest List</option>
            <option value="general">General</option>
            <option value="press">Press</option>
            <option value="industry">Industry</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedFans.length > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-4 flex items-center justify-between">
            <p className="text-purple-300 font-medium text-sm">
              {selectedFans.length} fan{selectedFans.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">
                Export Selected
              </button>
              <button
                onClick={() => setSelectedFans([])}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left pb-3 pr-4">
                  <input
                    type="checkbox"
                    checked={selectedFans.length === paginatedFans.length && paginatedFans.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Name</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Contact</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Category</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Location</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Total Spend</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Events</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFans.map((fan) => (
                <tr key={fan.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 pr-4">
                    <input
                      type="checkbox"
                      checked={selectedFans.includes(fan.id)}
                      onChange={() => toggleFanSelection(fan.id)}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 text-white text-sm font-medium">{fan.name}</td>
                  <td className="py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Mail className="w-3 h-3" />
                        {fan.email}
                      </div>
                      {fan.mobile && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Phone className="w-3 h-3" />
                          {fan.mobile}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3">{getCategoryBadge(fan.category)}</td>
                  <td className="py-3 text-gray-400 text-sm">{fan.location}</td>
                  <td className="py-3 text-white text-sm font-medium">£{fan.totalSpend.toLocaleString()}</td>
                  <td className="py-3 text-gray-400 text-sm">{fan.eventsAttended}</td>
                  <td className="py-3 text-gray-400 text-sm">{formatDate(fan.lastActive)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Showing {startIndex + 1}-{Math.min(startIndex + fansPerPage, filteredFans.length)} of {filteredFans.length.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-white text-sm px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-white font-bold text-xl">Export Segment Data</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-400 text-sm">Select which fields to include in your CSV export:</p>

              <div className="space-y-2">
                {Object.entries(exportOptions).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setExportOptions({ ...exportOptions, [key]: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-white text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-300 font-medium text-sm mb-1">Export includes:</p>
                    <p className="text-blue-200/80 text-xs">
                      {filteredFans.length.toLocaleString()} fans • {Object.values(exportOptions).filter(Boolean).length} fields
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={Object.values(exportOptions).every(v => !v)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>

              <h3 className="text-white font-bold text-xl mb-2">Delete Segment?</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{segment.name}"? This action cannot be undone.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-colors">
                  Delete Segment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}