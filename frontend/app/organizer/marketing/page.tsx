'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Users,
  TrendingUp,
  DollarSign,
  Send,
  Eye,
  MousePointer,
  ShoppingCart,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Music,
  Building2,
  ChevronDown,
  Target,
  Zap,
  BarChart3,
  X,
  Sparkles,
  Facebook,
  Twitter,
  Instagram,
  Check,
  Share2,
  Image as ImageIcon,
  Play,
  Pause,
} from 'lucide-react';

interface MarketingAccount {
  id: string;
  profileId: string;
  type: 'ARTIST' | 'ORGANIZER';
  name: string;
  fanCount: number;
  avatar?: string;
}

interface Campaign {
  id: string;
  name: string;
  type: 'NEW_SHOW' | 'EXCLUSIVE_ACCESS' | 'MERCH_DROP' | 'THANK_YOU' | 'CUSTOM';
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
  subject: string;
  recipients: number;
  sent?: number;
  opened?: number;
  clicked?: number;
  converted?: number;
  revenue?: number;
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
  event?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  thumbnail?: string;
}

export default function MarketingDashboard() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<MarketingAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<MarketingAccount | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAIGraphicsModal, setShowAIGraphicsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [linkCopied, setLinkCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'social'>('campaigns');

  // Mock data
  useEffect(() => {
    const mockAccounts: MarketingAccount[] = [
      {
        id: 'marketing_artist_1',
        profileId: 'profile_artist_1',
        type: 'ARTIST',
        name: 'Arctic Monkeys',
        fanCount: 12500,
      },
      {
        id: 'marketing_org_1',
        profileId: 'profile_org_1',
        type: 'ORGANIZER',
        name: 'Printworks London',
        fanCount: 8200,
      },
    ];
    
    setAccounts(mockAccounts);
    setActiveAccount(mockAccounts[0]);
    
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Summer Tour Announcement',
        type: 'NEW_SHOW',
        status: 'SENT',
        subject: "We're coming to your city! 🎸",
        recipients: 12500,
        sent: 12500,
        opened: 5200,
        clicked: 1800,
        converted: 420,
        revenue: 21000,
        sentAt: '2024-12-08T10:00:00Z',
        createdAt: '2024-12-07T15:30:00Z',
        event: 'Summer Music Festival 2025',
      },
      {
        id: '2',
        name: 'VIP Pre-Sale Access',
        type: 'EXCLUSIVE_ACCESS',
        status: 'SENT',
        subject: 'Exclusive pre-sale for our biggest fans ⭐',
        recipients: 1250,
        sent: 1250,
        opened: 890,
        clicked: 420,
        converted: 180,
        revenue: 13500,
        sentAt: '2024-12-05T14:00:00Z',
        createdAt: '2024-12-04T09:00:00Z',
        event: 'Summer Music Festival 2025',
      },
      {
        id: '3',
        name: 'New Merch Drop',
        type: 'MERCH_DROP',
        status: 'SCHEDULED',
        subject: 'Limited edition tour merch - drops Friday! 🔥',
        recipients: 12500,
        scheduledFor: '2024-12-13T18:00:00Z',
        createdAt: '2024-12-09T11:20:00Z',
        event: 'Summer Music Festival 2025',
      },
      {
        id: '4',
        name: 'Thank You Manchester',
        type: 'THANK_YOU',
        status: 'DRAFT',
        subject: 'Thank you Manchester - what a night! 🎉',
        recipients: 0,
        createdAt: '2024-12-09T16:45:00Z',
        event: 'Summer Music Festival 2025',
      },
    ];
    
    setCampaigns(mockCampaigns);
  }, []);

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'launch',
      name: 'Event Launch',
      description: 'Announce your event with excitement',
      preview: 'Get ready! [Event Name] tickets are now available...',
    },
    {
      id: 'reminder',
      name: 'Event Reminder',
      description: 'Remind ticket holders about upcoming event',
      preview: 'This is it! [Event Name] is happening tomorrow...',
    },
    {
      id: 'last-chance',
      name: 'Last Chance',
      description: 'Create urgency for remaining tickets',
      preview: 'Final call! Only a few tickets left for [Event Name]...',
    },
    {
      id: 'thank-you',
      name: 'Thank You',
      description: 'Thank attendees after the event',
      preview: 'Thank you for joining us at [Event Name]!...',
    },
  ];

  const handleSwitchAccount = (account: MarketingAccount) => {
    setActiveAccount(account);
    setShowAccountSwitcher(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://lurexo.com/events/summer-fest-2025`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'NEW_SHOW': return Calendar;
      case 'EXCLUSIVE_ACCESS': return Target;
      case 'MERCH_DROP': return ShoppingCart;
      case 'THANK_YOU': return Mail;
      default: return Zap;
    }
  };

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'NEW_SHOW': return 'bg-blue-500/20 text-blue-400';
      case 'EXCLUSIVE_ACCESS': return 'bg-purple-500/20 text-purple-400';
      case 'MERCH_DROP': return 'bg-green-500/20 text-green-400';
      case 'THANK_YOU': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle };
      case 'SCHEDULED':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock };
      case 'DRAFT':
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Edit };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: AlertCircle };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const calculateStats = () => {
    const sentCampaigns = campaigns.filter(c => c.status === 'SENT');
    const totalSent = sentCampaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
    const totalOpened = sentCampaigns.reduce((sum, c) => sum + (c.opened || 0), 0);
    const totalClicked = sentCampaigns.reduce((sum, c) => sum + (c.clicked || 0), 0);
    const totalRevenue = sentCampaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);
    
    const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
    
    return { totalSent, totalOpened, totalClicked, totalRevenue, openRate, clickRate };
  };

  const stats = calculateStats();

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || campaign.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (!activeAccount) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading marketing accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Account Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-white font-bold text-2xl sm:text-3xl">Marketing</h1>
          <p className="text-gray-400 mt-1">Reach your fans with targeted campaigns</p>
        </div>

        {/* Account Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
            className="flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                {activeAccount.type === 'ARTIST' ? (
                  <Music className="w-5 h-5 text-white" />
                ) : (
                  <Building2 className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">{activeAccount.name}</p>
                <p className="text-gray-400 text-xs">
                  {activeAccount.fanCount.toLocaleString()} fans
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showAccountSwitcher && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50">
              <div className="p-2">
                <p className="text-gray-400 text-xs font-medium px-3 py-2">Switch Account</p>
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleSwitchAccount(account)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      account.id === activeAccount.id
                        ? 'bg-purple-600/20 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      account.type === 'ARTIST' 
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                        : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                    }`}>
                      {account.type === 'ARTIST' ? (
                        <Music className="w-5 h-5 text-white" />
                      ) : (
                        <Building2 className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{account.name}</p>
                      <p className="text-xs text-gray-400">
                        {account.type === 'ARTIST' ? '🎤 Artist' : '🏢 Organizer'} • {account.fanCount.toLocaleString()} fans
                      </p>
                    </div>
                    {account.id === activeAccount.id && (
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="border-t border-gray-700 p-2">
                <Link
                  href="/settings/profiles/create"
                  className="w-full flex items-center gap-2 px-3 py-2 text-purple-400 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create New Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-gray-400">+12% this month</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Fans</p>
          <p className="text-white font-bold text-3xl">{activeAccount.fanCount.toLocaleString()}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-green-400">+3.2%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Avg Open Rate</p>
          <p className="text-white font-bold text-3xl">{stats.openRate.toFixed(1)}%</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <MousePointer className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-green-400">+1.8%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Avg Click Rate</p>
          <p className="text-white font-bold text-3xl">{stats.clickRate.toFixed(1)}%</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-green-400">+18%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Revenue Generated</p>
          <p className="text-white font-bold text-3xl">£{(stats.totalRevenue / 1000).toFixed(1)}k</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href={`/organizer/marketing/campaigns/new?accountId=${activeAccount.id}`}
          className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-6 rounded-xl transition-all group block"
        >
          <Calendar className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-bold text-lg mb-1">New Campaign</h3>
          <p className="text-blue-100 text-sm">Create email campaign</p>
        </Link>

        <button
          onClick={() => setShowTemplateModal(true)}
          className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 p-6 rounded-xl transition-all group text-left"
        >
          <Mail className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-bold text-lg mb-1">Templates</h3>
          <p className="text-purple-100 text-sm">Browse email templates</p>
        </button>

        <button
          onClick={() => setShowAIGraphicsModal(true)}
          className="bg-gradient-to-br from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 p-6 rounded-xl transition-all group text-left"
        >
          <Sparkles className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-bold text-lg mb-1">AI Graphics</h3>
          <p className="text-pink-100 text-sm">Generate social posts</p>
        </button>

        <Link
          href="/organizer/marketing/segments"
          className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 p-6 rounded-xl transition-all group block"
        >
          <Users className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-bold text-lg mb-1">Segments</h3>
          <p className="text-green-100 text-sm">Manage audiences</p>
        </Link>
      </div>

      {/* Quick Share Section */}
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Quick Share
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Event Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value="https://lurexo.com/events/summer-fest-2025"
                readOnly
                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
              >
                {linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Share On</label>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-medium transition-colors">
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-sm font-medium transition-colors">
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-white font-bold text-xl">Campaigns</h2>
              <p className="text-gray-400 text-sm">All your marketing campaigns in one place</p>
            </div>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Campaign
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Campaign</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Type</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Recipients</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Performance</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Date</th>
                <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredCampaigns.map((campaign) => {
                const StatusBadge = getStatusBadge(campaign.status);
                const TypeIcon = getCampaignTypeIcon(campaign.type);
                
                return (
                  <tr key={campaign.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <Link 
                          href={`/organizer/marketing/campaigns/${campaign.id}`}
                          className="text-white font-medium hover:text-purple-400 transition-colors"
                        >
                          {campaign.name}
                        </Link>
                        <p className="text-gray-400 text-sm">{campaign.subject}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getCampaignTypeColor(campaign.type)}`}>
                        <TypeIcon className="w-3.5 h-3.5" />
                        {campaign.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${StatusBadge.bg} ${StatusBadge.text}`}>
                        <StatusBadge.icon className="w-3.5 h-3.5" />
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{campaign.recipients.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      {campaign.status === 'SENT' && campaign.opened ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Eye className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300">
                              {((campaign.opened / campaign.sent!) * 100).toFixed(1)}% opened
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MousePointer className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300">
                              {((campaign.clicked! / campaign.opened) * 100).toFixed(1)}% clicked
                            </span>
                          </div>
                          {campaign.revenue && (
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-yellow-400" />
                              <span className="text-gray-300">£{campaign.revenue.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      ) : campaign.status === 'SCHEDULED' ? (
                        <p className="text-gray-400 text-sm">Scheduled</p>
                      ) : (
                        <p className="text-gray-400 text-sm">Not sent</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 text-sm">
                        {campaign.sentAt ? formatDate(campaign.sentAt) : 
                         campaign.scheduledFor ? formatDate(campaign.scheduledFor) : 
                         formatDate(campaign.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {campaign.status === 'SENT' && (
                          <Link
                            href={`/organizer/marketing/campaigns/${campaign.id}`}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                        )}
                        {campaign.status === 'DRAFT' && (
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="p-12 text-center">
            <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">No campaigns found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your filters'
                : 'Create your first campaign to start reaching your fans'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <button
                onClick={() => setShowCampaignModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Campaign
              </button>
            )}
          </div>
        )}
      </div>

      {/* Campaign Creation Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-white font-bold text-xl">Create Campaign</h2>
                <p className="text-gray-400 text-sm">Send targeted messages to your fans</p>
              </div>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block text-sm">Campaign Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Summer Festival Launch"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block text-sm">Subject Line *</label>
                <input
                  type="text"
                  placeholder="Make it catchy!"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block text-sm">Message *</label>
                <textarea
                  rows={8}
                  placeholder="Write your message here..."
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block text-sm">Send To *</label>
                <select className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors">
                  <option>All Fans ({activeAccount.fanCount.toLocaleString()} people)</option>
                  <option>Top 10% VIP ({Math.floor(activeAccount.fanCount * 0.1).toLocaleString()} people)</option>
                  <option>Regional: London ({Math.floor(activeAccount.fanCount * 0.4).toLocaleString()} people)</option>
                  <option>Past Attendees ({Math.floor(activeAccount.fanCount * 0.6).toLocaleString()} people)</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Gallery Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-white font-bold text-xl">Email Templates</h2>
                <p className="text-gray-400 text-sm">Choose a template to get started</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emailTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setShowTemplateModal(false);
                      setShowCampaignModal(true);
                    }}
                    className="bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all text-left"
                  >
                    <div className="h-32 bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                      <Mail className="w-12 h-12 text-gray-600" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-semibold mb-1">{template.name}</h4>
                      <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                      <p className="text-gray-500 text-xs italic mb-3">{template.preview}</p>
                      <span className="text-purple-400 text-sm font-medium">
                        Use Template →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Graphics Modal */}
      {showAIGraphicsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full">
            <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">AI Graphics Generator</h2>
                  <p className="text-gray-400 text-sm">Create eye-catching social media graphics</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIGraphicsModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-white font-medium mb-3 block">Choose Format</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-left transition-colors">
                    <Instagram className="w-8 h-8 text-pink-400 mb-2" />
                    <p className="text-white font-semibold">Instagram Post</p>
                    <p className="text-gray-400 text-xs">1080 × 1080px</p>
                  </button>
                  <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-left transition-colors">
                    <Instagram className="w-8 h-8 text-purple-400 mb-2" />
                    <p className="text-white font-semibold">Instagram Story</p>
                    <p className="text-gray-400 text-xs">1080 × 1920px</p>
                  </button>
                  <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-left transition-colors">
                    <Facebook className="w-8 h-8 text-blue-400 mb-2" />
                    <p className="text-white font-semibold">Facebook Post</p>
                    <p className="text-gray-400 text-xs">1200 × 630px</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block text-sm">Describe Your Graphic</label>
                <textarea
                  rows={4}
                  placeholder="e.g., Summer music festival poster with vibrant colors, sunset theme, featuring the event name and date..."
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <button
                onClick={() => {
                  alert('AI Graphics generation coming soon!');
                  setShowAIGraphicsModal(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Generate with AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}