'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  TrendingUp,
  Mail,
  MailOpen,
  Clock,
  Calendar,
  MapPin,
  Download,
  Copy,
  Send,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle,
  Minus,
  BarChart3,
  Smartphone,
  Monitor,
  Tablet,
  MoreVertical,
  X,
} from 'lucide-react';

interface Recipient {
  id: string;
  name: string;
  email: string;
  status: 'opened' | 'clicked' | 'not_opened';
  openedAt?: string;
  clickedAt?: string;
  device?: 'mobile' | 'desktop' | 'tablet';
}

export default function CampaignDetailsPage() {
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [recipientFilter, setRecipientFilter] = useState<'all' | 'opened' | 'clicked' | 'not_opened'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recipientsPerPage = 50;

  // Mock campaign data
  const campaign = {
    id: 'campaign_1',
    name: 'Summer Tour Announcement',
    subject: "We're coming to London! 🎸",
    status: 'sent',
    sentAt: '2024-12-10T14:30:00Z',
    accountName: 'Arctic Monkeys',
    accountType: 'ARTIST' as const,
    content: `Hey {first_name},

Exciting news! We're thrilled to announce a brand new show coming to London.

📅 Date: July 15, 2025
📍 Venue: O2 Arena
🎫 Tickets: On sale now

This is going to be an incredible night. Don't miss out!

Get your tickets here: https://lurexo.com/events/arctic-monkeys-london

See you there!`,
  };

  // Mock performance data
  const performance = {
    sent: 12500,
    delivered: 12450,
    deliveryRate: 99.6,
    opened: 5180,
    openRate: 41.6,
    clicked: 1560,
    clickRate: 12.5,
    revenue: 21000,
    unsubscribed: 12,
    unsubscribeRate: 0.1,
  };

  // Mock time series data (opens over time)
  const opensByHour = [
    { hour: '14:00', opens: 850 },
    { hour: '15:00', opens: 1240 },
    { hour: '16:00', opens: 980 },
    { hour: '17:00', opens: 720 },
    { hour: '18:00', opens: 580 },
    { hour: '19:00', opens: 420 },
    { hour: '20:00', opens: 290 },
    { hour: '21:00', opens: 100 },
  ];

  // Mock device breakdown
  const deviceBreakdown = [
    { device: 'Mobile', count: 3367, percentage: 65 },
    { device: 'Desktop', count: 1554, percentage: 30 },
    { device: 'Tablet', count: 259, percentage: 5 },
  ];

  // Mock geographic data
  const topCities = [
    { city: 'London', count: 3200, percentage: 62 },
    { city: 'Manchester', count: 850, percentage: 16 },
    { city: 'Birmingham', count: 520, percentage: 10 },
    { city: 'Leeds', count: 360, percentage: 7 },
    { city: 'Bristol', count: 250, percentage: 5 },
  ];

  // Mock recipients data
  const allRecipients: Recipient[] = Array.from({ length: 12450 }, (_, i) => ({
    id: `recipient_${i + 1}`,
    name: `Fan ${i + 1}`,
    email: `fan${i + 1}@example.com`,
    status: i < 5180 ? (i < 1560 ? 'clicked' : 'opened') : 'not_opened',
    openedAt: i < 5180 ? '2024-12-10T15:30:00Z' : undefined,
    clickedAt: i < 1560 ? '2024-12-10T15:45:00Z' : undefined,
    device: i < 5180 ? (['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)] as any) : undefined,
  }));

  // Filter recipients
  const filteredRecipients = allRecipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = recipientFilter === 'all' || recipient.status === recipientFilter;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecipients.length / recipientsPerPage);
  const startIndex = (currentPage - 1) * recipientsPerPage;
  const paginatedRecipients = filteredRecipients.slice(startIndex, startIndex + recipientsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clicked': return <MousePointer className="w-4 h-4 text-green-400" />;
      case 'opened': return <MailOpen className="w-4 h-4 text-blue-400" />;
      case 'not_opened': return <Mail className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getDeviceIcon = (device?: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="w-4 h-4 text-gray-400" />;
      case 'desktop': return <Monitor className="w-4 h-4 text-gray-400" />;
      case 'tablet': return <Tablet className="w-4 h-4 text-gray-400" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex-1">
          <Link
            href="/organizer/marketing"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-2 transition-colors"
          >
            ← Back to Marketing
          </Link>
          <h1 className="text-white font-bold text-2xl sm:text-3xl">{campaign.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
              {campaign.status}
            </span>
            <span className="text-gray-400 text-sm">
              Sent {formatDate(campaign.sentAt)} to {performance.sent.toLocaleString()} fans
            </span>
          </div>
          <p className="text-gray-400 mt-1">
            <strong>Subject:</strong> {campaign.subject}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-colors text-sm">
            <Copy className="w-4 h-4" />
            Duplicate Campaign
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors text-sm">
            <Send className="w-4 h-4" />
            Send to More Segments
          </button>
          <button 
            onClick={() => setShowEmailPreview(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            View Email
          </button>
          
          {/* More Actions Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="flex items-center justify-center px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm h-full"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showActionsMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50">
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors text-sm text-left">
                    <Mail className="w-4 h-4" />
                    Resend to Non-Openers
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors text-sm text-left">
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors text-sm text-left">
                    <Edit className="w-4 h-4" />
                    Edit Campaign
                  </button>
                  <div className="border-t border-gray-700 my-2" />
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors text-sm text-left">
                    <Trash2 className="w-4 h-4" />
                    Delete Campaign
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics - Sticky */}
      <div className="sticky top-0 z-30 bg-gray-950 pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Delivered</p>
          <p className="text-white font-bold text-3xl mb-1">{performance.delivered.toLocaleString()}</p>
          <p className="text-green-400 text-sm">{performance.deliveryRate}% delivery rate</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <MailOpen className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Opened</p>
          <p className="text-white font-bold text-3xl mb-1">{performance.opened.toLocaleString()}</p>
          <p className="text-green-400 text-sm">{performance.openRate}% open rate</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <MousePointer className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Clicked</p>
          <p className="text-white font-bold text-3xl mb-1">{performance.clicked.toLocaleString()}</p>
          <p className="text-green-400 text-sm">{performance.clickRate}% click rate</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Revenue</p>
          <p className="text-white font-bold text-3xl mb-1">£{(performance.revenue / 1000).toFixed(1)}k</p>
          <p className="text-gray-400 text-sm">From ticket sales</p>
        </div>
      </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Opens Over Time */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Opens Over Time
          </h3>
          <div className="space-y-3">
            {opensByHour.map((data, index) => {
              const maxOpens = Math.max(...opensByHour.map(d => d.opens));
              const percentage = (data.opens / maxOpens) * 100;
              
              return (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-sm">{data.hour}</span>
                    <span className="text-white text-sm font-medium">{data.opens} opens</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 group-hover:from-blue-500 group-hover:to-purple-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engagement Breakdown - Combined Device + Geographic */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Engagement Breakdown
          </h3>
          
          {/* Device Section */}
          <div className="mb-6 pb-6 border-b border-gray-800">
            <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gray-400" />
              By Device
            </h4>
            <div className="space-y-3">
              {deviceBreakdown.map((data, index) => {
                const Icon = data.device === 'Mobile' ? Smartphone : data.device === 'Desktop' ? Monitor : Tablet;
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm font-medium">{data.device}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{data.count.toLocaleString()} ({data.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          data.device === 'Mobile' ? 'bg-blue-500' :
                          data.device === 'Desktop' ? 'bg-purple-500' : 'bg-pink-500'
                        }`}
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geographic Section */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              Top Cities
            </h4>
            <div className="space-y-3">
              {topCities.slice(0, 3).map((data, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{data.city}</span>
                    <span className="text-gray-400 text-sm">{data.count.toLocaleString()} ({data.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-blue-600 rounded-full transition-all duration-300 group-hover:from-green-500 group-hover:to-blue-500"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recipients List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Recipients ({filteredRecipients.length.toLocaleString()})
        </h3>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white pl-12 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <select
            value={recipientFilter}
            onChange={(e) => setRecipientFilter(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="all">All Recipients</option>
            <option value="clicked">Clicked</option>
            <option value="opened">Opened</option>
            <option value="not_opened">Not Opened</option>
          </select>
        </div>

        {/* Recipients Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Name</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Email</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Status</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Device</th>
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Opened At</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecipients.map((recipient) => (
                <tr key={recipient.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 text-white text-sm">{recipient.name}</td>
                  <td className="py-3 text-gray-400 text-sm">{recipient.email}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(recipient.status)}
                      <span className={`text-sm ${
                        recipient.status === 'clicked' ? 'text-green-400' :
                        recipient.status === 'opened' ? 'text-blue-400' : 'text-gray-400'
                      }`}>
                        {recipient.status === 'clicked' ? 'Clicked' :
                         recipient.status === 'opened' ? 'Opened' : 'Not Opened'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(recipient.device)}
                      <span className="text-gray-400 text-sm capitalize">{recipient.device || '-'}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-400 text-sm">
                    {recipient.openedAt ? formatDate(recipient.openedAt) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Showing {startIndex + 1}-{Math.min(startIndex + recipientsPerPage, filteredRecipients.length)} of {filteredRecipients.length.toLocaleString()}
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

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-white font-bold text-xl">Email Preview</h2>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Email Header */}
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">From:</span>
                  <span className="text-white text-sm">{campaign.accountName} &lt;noreply@lurexo.com&gt;</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Subject:</span>
                  <span className="text-white text-sm font-medium">{campaign.subject}</span>
                </div>
              </div>

              {/* Email Body */}
              <div className="bg-white rounded-lg p-8">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{campaign.accountName}</h1>
                  </div>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {campaign.content.replace('{first_name}', 'John')}
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                    <p>You're receiving this because you subscribed to {campaign.accountName} updates.</p>
                    <p className="mt-2">
                      <a href="#" className="text-blue-600 hover:underline">Unsubscribe</a>
                      {' • '}
                      <a href="#" className="text-blue-600 hover:underline">Update preferences</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}