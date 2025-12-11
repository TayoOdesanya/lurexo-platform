'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  Filter,
  TrendingUp,
  MapPin,
  Star,
  Calendar,
  Clock,
  Eye,
  MousePointer,
  DollarSign,
  Send,
  Edit,
  Trash2,
  Download,
  X,
  ChevronRight,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Segment {
  id: string;
  name: string;
  description: string;
  type: 'auto' | 'custom';
  icon: 'star' | 'location' | 'ticket' | 'clock' | 'target';
  memberCount: number;
  engagement: number;
  lastCampaign?: {
    name: string;
    openRate: number;
    clickRate: number;
    revenue: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([
    {
      id: '1',
      name: 'VIP Fans (Top 10%)',
      description: 'Your most engaged fans by spend and attendance',
      type: 'auto',
      icon: 'star',
      memberCount: 1250,
      engagement: 85,
      lastCampaign: {
        name: 'VIP Pre-Sale Access',
        openRate: 71.2,
        clickRate: 33.6,
        revenue: 13500,
      },
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
    },
    {
      id: '2',
      name: 'London Fans',
      description: 'Fans based in London and surrounding areas',
      type: 'auto',
      icon: 'location',
      memberCount: 5200,
      engagement: 62,
      lastCampaign: {
        name: 'Summer Tour Announcement',
        openRate: 58.3,
        clickRate: 24.1,
        revenue: 8400,
      },
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
    },
    {
      id: '3',
      name: 'Past Attendees',
      description: 'Fans who have attended at least one event',
      type: 'auto',
      icon: 'ticket',
      memberCount: 7500,
      engagement: 72,
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
    },
    {
      id: '4',
      name: 'New Fans (30 days)',
      description: 'Fans who joined in the last 30 days',
      type: 'auto',
      icon: 'clock',
      memberCount: 890,
      engagement: 45,
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
    },
    {
      id: '5',
      name: 'High Spenders',
      description: 'Custom segment: Fans who spent £100+',
      type: 'custom',
      icon: 'target',
      memberCount: 420,
      engagement: 78,
      lastCampaign: {
        name: 'Exclusive Merch Drop',
        openRate: 64.5,
        clickRate: 31.2,
        revenue: 5200,
      },
      createdAt: '2024-12-01T10:30:00Z',
      updatedAt: '2024-12-09T14:20:00Z',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'auto' | 'custom'>('all');

  // Create segment form state
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    filters: {
      location: '',
      minSpend: '',
      minEvents: '',
      engagement: 'all',
      lastActive: 'all',
    },
  });

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'star': return Star;
      case 'location': return MapPin;
      case 'ticket': return Calendar;
      case 'clock': return Clock;
      case 'target': return Target;
      default: return Users;
    }
  };

  const getIconColor = (icon: string) => {
    switch (icon) {
      case 'star': return 'bg-yellow-500/20 text-yellow-400';
      case 'location': return 'bg-blue-500/20 text-blue-400';
      case 'ticket': return 'bg-green-500/20 text-green-400';
      case 'clock': return 'bg-purple-500/20 text-purple-400';
      case 'target': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredSegments = segments.filter(segment => {
    const matchesSearch = segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         segment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || segment.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalFans = segments.reduce((sum, seg) => sum + seg.memberCount, 0);
  const avgEngagement = segments.reduce((sum, seg) => sum + seg.engagement, 0) / segments.length;

  const handleCreateSegment = () => {
    // TODO: API call to create segment
    console.log('Creating segment:', createForm);
    setShowCreateModal(false);
    // Reset form
    setCreateForm({
      name: '',
      description: '',
      filters: {
        location: '',
        minSpend: '',
        minEvents: '',
        engagement: 'all',
        lastActive: 'all',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/organizer/marketing"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-2 transition-colors"
          >
            ← Back to Marketing
          </Link>
          <h1 className="text-white font-bold text-2xl sm:text-3xl">Audience Segments</h1>
          <p className="text-gray-400 mt-1">Organize and target your fans effectively</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Segment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Segments</p>
          <p className="text-white font-bold text-3xl">{segments.length}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Unique Fans Reached</p>
          <p className="text-white font-bold text-3xl">{totalFans.toLocaleString()}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Avg Engagement</p>
          <p className="text-white font-bold text-3xl">{avgEngagement.toFixed(0)}%</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
        >
          <option value="all">All Segments</option>
          <option value="auto">Auto-Generated</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSegments.map((segment) => {
          const Icon = getIcon(segment.icon);
          const iconColor = getIconColor(segment.icon);

          return (
            <div
              key={segment.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-3 rounded-lg ${iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-lg">{segment.name}</h3>
                      {segment.type === 'auto' ? (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
                          Auto
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{segment.description}</p>
                  </div>
                </div>
                {segment.type === 'custom' && (
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Members</p>
                  <p className="text-white font-bold text-xl">{segment.memberCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Engagement</p>
                  <p className="text-white font-bold text-xl">{segment.engagement}%</p>
                </div>
              </div>

              {/* Last Campaign */}
              {segment.lastCampaign ? (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <p className="text-gray-400 text-xs mb-2">Last Campaign Performance</p>
                  <p className="text-white font-medium text-sm mb-3">{segment.lastCampaign.name}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Eye className="w-3 h-3 text-blue-400" />
                        <p className="text-xs text-gray-400">Opens</p>
                      </div>
                      <p className="text-white font-semibold text-sm">{segment.lastCampaign.openRate}%</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <MousePointer className="w-3 h-3 text-green-400" />
                        <p className="text-xs text-gray-400">Clicks</p>
                      </div>
                      <p className="text-white font-semibold text-sm">{segment.lastCampaign.clickRate}%</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-yellow-400" />
                        <p className="text-xs text-gray-400">Revenue</p>
                      </div>
                      <p className="text-white font-semibold text-sm">£{(segment.lastCampaign.revenue / 1000).toFixed(1)}k</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/30 rounded-lg p-4 mb-4 text-center">
                  <p className="text-gray-500 text-sm">No campaigns sent yet</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/organizer/marketing/segments/${segment.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
                <Link
                  href={`/organizer/marketing/campaigns/new?segment=${segment.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Campaign
                </Link>
              </div>

              {/* Meta */}
              <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <span>Created {formatDate(segment.createdAt)}</span>
                {segment.type === 'custom' && (
                  <button className="text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSegments.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">No segments found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery || filterType !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first segment to start organizing your audience'}
          </p>
          {!searchQuery && filterType === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Segment
            </button>
          )}
        </div>
      )}

      {/* Create Segment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-white font-bold text-xl">Create Custom Segment</h2>
                <p className="text-gray-400 text-sm">Define criteria to organize your fans</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Basic Info */}
              <div>
                <label className="text-white font-medium mb-2 block text-sm">Segment Name *</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g., High Spenders"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block text-sm">Description (Optional)</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Brief description of this segment"
                  rows={2}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              {/* Filters */}
              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-white font-semibold mb-4">Filters</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Location</label>
                    <input
                      type="text"
                      value={createForm.filters.location}
                      onChange={(e) => setCreateForm({ ...createForm, filters: { ...createForm.filters, location: e.target.value } })}
                      placeholder="e.g., London, Manchester, UK"
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Min Spend (£)</label>
                      <input
                        type="number"
                        value={createForm.filters.minSpend}
                        onChange={(e) => setCreateForm({ ...createForm, filters: { ...createForm.filters, minSpend: e.target.value } })}
                        placeholder="0"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Min Events Attended</label>
                      <input
                        type="number"
                        value={createForm.filters.minEvents}
                        onChange={(e) => setCreateForm({ ...createForm, filters: { ...createForm.filters, minEvents: e.target.value } })}
                        placeholder="0"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Engagement Level</label>
                    <select
                      value={createForm.filters.engagement}
                      onChange={(e) => setCreateForm({ ...createForm, filters: { ...createForm.filters, engagement: e.target.value } })}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="all">All Levels</option>
                      <option value="high">High (75%+)</option>
                      <option value="medium">Medium (50-75%)</option>
                      <option value="low">Low (&lt;50%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Last Active</label>
                    <select
                      value={createForm.filters.lastActive}
                      onChange={(e) => setCreateForm({ ...createForm, filters: { ...createForm.filters, lastActive: e.target.value } })}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="all">Any Time</option>
                      <option value="7days">Last 7 days</option>
                      <option value="30days">Last 30 days</option>
                      <option value="90days">Last 90 days</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-300 font-medium text-sm mb-1">Live Preview</p>
                    <p className="text-blue-200/80 text-sm">
                      Estimated members: <strong>~420 fans</strong>
                    </p>
                    <p className="text-blue-200/60 text-xs mt-1">
                      Preview updates as you adjust filters
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSegment}
                  disabled={!createForm.name}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Create Segment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}