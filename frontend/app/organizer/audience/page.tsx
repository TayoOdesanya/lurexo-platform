'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Ticket,
  Heart,
  Star,
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  Send,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Award,
  Activity,
  Clock,
  DollarSign,
  Share2,
  MessageCircle,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Zap,
  Target,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function AudiencePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSegment, setFilterSegment] = useState('all');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedFans, setSelectedFans] = useState<string[]>([]);

  // Mock data - Overview stats
  const totalFans = 12847;
  const newThisMonth = 1243;
  const activeRate = 73.4;
  const avgLifetimeValue = 287;

  // Age distribution
  const ageData = [
    { name: '18-24', value: 2847, percentage: 22 },
    { name: '25-34', value: 4512, percentage: 35 },
    { name: '35-44', value: 3210, percentage: 25 },
    { name: '45-54', value: 1542, percentage: 12 },
    { name: '55+', value: 736, percentage: 6 }
  ];

  // Gender distribution
  const genderData = [
    { name: 'Female', value: 7108, color: '#ec4899' },
    { name: 'Male', value: 5227, color: '#3b82f6' },
    { name: 'Other', value: 512, color: '#8b5cf6' }
  ];

  // Location data
  const locationData = [
    { city: 'London', fans: 5210, percentage: 40.5 },
    { city: 'Manchester', fans: 1927, percentage: 15.0 },
    { city: 'Birmingham', fans: 1503, percentage: 11.7 },
    { city: 'Edinburgh', fans: 1131, percentage: 8.8 },
    { city: 'Glasgow', fans: 950, percentage: 7.4 },
    { city: 'Other', age: 2126, percentage: 16.5 }
  ];

  // Device usage
  const deviceData = [
    { name: 'Mobile', value: 58.3, color: '#8b5cf6' },
    { name: 'Desktop', value: 33.2, color: '#3b82f6' },
    { name: 'Tablet', value: 8.5, color: '#10b981' }
  ];

  // Engagement over time
  const engagementData = [
    { month: 'Jun', engagement: 62, retention: 45 },
    { month: 'Jul', engagement: 68, retention: 52 },
    { month: 'Aug', engagement: 71, retention: 58 },
    { month: 'Sep', engagement: 75, retention: 64 },
    { month: 'Oct', engagement: 79, retention: 68 },
    { month: 'Nov', engagement: 82, retention: 73 }
  ];

  // Top fans
  const topFans = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      email: 'sarah.m@email.com',
      avatar: null,
      eventsAttended: 8,
      totalSpent: 1240,
      lastPurchase: '2025-11-28',
      segment: 'vip',
      location: 'London, UK'
    },
    {
      id: '2',
      name: 'James Cooper',
      email: 'james.c@email.com',
      avatar: null,
      eventsAttended: 6,
      totalSpent: 890,
      lastPurchase: '2025-11-25',
      segment: 'regular',
      location: 'Manchester, UK'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      email: 'emma.t@email.com',
      avatar: null,
      eventsAttended: 5,
      totalSpent: 720,
      lastPurchase: '2025-11-20',
      segment: 'regular',
      location: 'Birmingham, UK'
    },
    {
      id: '4',
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      avatar: null,
      eventsAttended: 7,
      totalSpent: 1050,
      lastPurchase: '2025-11-15',
      segment: 'vip',
      location: 'Edinburgh, UK'
    },
    {
      id: '5',
      name: 'Sophie Wilson',
      email: 'sophie.w@email.com',
      avatar: null,
      eventsAttended: 4,
      totalSpent: 580,
      lastPurchase: '2025-11-10',
      segment: 'regular',
      location: 'London, UK'
    }
  ];

  // All fans list (for the list view)
  const allFans = [
    ...topFans,
    {
      id: '6',
      name: 'David Anderson',
      email: 'david.a@email.com',
      avatar: null,
      eventsAttended: 3,
      totalSpent: 420,
      lastPurchase: '2025-11-08',
      segment: 'casual',
      location: 'Glasgow, UK'
    },
    {
      id: '7',
      name: 'Lucy Davies',
      email: 'lucy.d@email.com',
      avatar: null,
      eventsAttended: 2,
      totalSpent: 280,
      lastPurchase: '2025-11-05',
      segment: 'new',
      location: 'Bristol, UK'
    },
    {
      id: '8',
      name: 'Tom Harris',
      email: 'tom.h@email.com',
      avatar: null,
      eventsAttended: 5,
      totalSpent: 750,
      lastPurchase: '2025-11-02',
      segment: 'regular',
      location: 'Leeds, UK'
    }
  ];

  // Segments
  const segments = [
    { id: 'vip', name: 'VIP Fans', count: 847, color: 'purple', description: '5+ events attended' },
    { id: 'regular', name: 'Regular Fans', count: 3210, color: 'blue', description: '2-4 events attended' },
    { id: 'casual', name: 'Casual Fans', count: 5124, color: 'green', description: '1 event attended' },
    { id: 'new', name: 'New Fans', count: 3666, color: 'orange', description: 'First purchase this month' }
  ];

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'vip':
        return 'bg-purple-500/20 text-purple-400';
      case 'regular':
        return 'bg-blue-500/20 text-blue-400';
      case 'casual':
        return 'bg-green-500/20 text-green-400';
      case 'new':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleSelectFan = (fanId: string) => {
    if (selectedFans.includes(fanId)) {
      setSelectedFans(selectedFans.filter(id => id !== fanId));
    } else {
      setSelectedFans([...selectedFans, fanId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFans.length === allFans.length) {
      setSelectedFans([]);
    } else {
      setSelectedFans(allFans.map(fan => fan.id));
    }
  };

  const filteredFans = allFans.filter(fan => {
    if (filterSegment !== 'all' && fan.segment !== filterSegment) return false;
    if (searchQuery && !fan.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !fan.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">
          Audience
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Understand and engage with your fans
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {/* Total Fans */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <div className="flex items-center gap-1 text-purple-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>15%</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Fans</p>
          <p className="text-white font-bold text-xl sm:text-2xl">{totalFans.toLocaleString()}</p>
        </div>

        {/* New This Month */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <div className="flex items-center gap-1 text-blue-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>23%</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">New This Month</p>
          <p className="text-white font-bold text-xl sm:text-2xl">{newThisMonth.toLocaleString()}</p>
        </div>

        {/* Active Rate */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>8%</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Active Rate</p>
          <p className="text-white font-bold text-xl sm:text-2xl">{activeRate}%</p>
        </div>

        {/* Avg Lifetime Value */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            <div className="flex items-center gap-1 text-orange-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>12%</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Avg Lifetime Value</p>
          <p className="text-white font-bold text-xl sm:text-2xl">£{avgLifetimeValue}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 mb-6 sm:mb-8">
        <div className="border-b border-gray-800 px-4 sm:px-6">
          <div className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'list'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Fan List
            </button>
            <button
              onClick={() => setActiveTab('segments')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'segments'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Segments
            </button>
            <button
              onClick={() => setActiveTab('engagement')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'engagement'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Engagement
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Demographics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Age Distribution */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Age Distribution</h3>
                  <div className="space-y-3">
                    {ageData.map((age) => (
                      <div key={age.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">{age.name}</span>
                          <span className="text-white font-semibold">{age.value.toLocaleString()} ({age.percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                            style={{ width: `${age.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender Distribution */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Gender Distribution</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-48 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {genderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {genderData.map((gender) => (
                      <div key={gender.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: gender.color }}></div>
                          <span className="text-gray-400 text-sm">{gender.name}</span>
                        </div>
                        <span className="text-white font-semibold text-sm">
                          {gender.value.toLocaleString()} ({Math.round((gender.value / totalFans) * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location & Device */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Locations */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Top Locations</h3>
                  <div className="space-y-3">
                    {locationData.map((location, index) => (
                      <div key={location.city} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm">{location.city}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${location.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-400 text-xs whitespace-nowrap">{location.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Usage */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Device Usage</h3>
                  <div className="space-y-4">
                    {deviceData.map((device) => {
                      const Icon = device.name === 'Mobile' ? Smartphone : device.name === 'Desktop' ? Monitor : Tablet;
                      return (
                        <div key={device.name}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400 text-sm">{device.name}</span>
                            </div>
                            <span className="text-white font-semibold text-sm">{device.value}%</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ 
                                width: `${device.value}%`,
                                backgroundColor: device.color
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Top Fans */}
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">Top Fans</h3>
                  <Link href="#" onClick={() => setActiveTab('list')}>
                    <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                      View All
                    </button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {topFans.map((fan, index) => (
                    <div key={fan.id} className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl hover:bg-gray-750 transition-colors">
                      <div className="flex items-center gap-1 text-gray-500 text-sm font-semibold w-6">
                        #{index + 1}
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {fan.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{fan.name}</p>
                        <p className="text-gray-400 text-xs">{fan.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold text-sm">{fan.eventsAttended} events</p>
                        <p className="text-gray-400 text-xs">£{fan.totalSpent.toLocaleString()} spent</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getSegmentColor(fan.segment)}`}>
                        {fan.segment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fan List Tab */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Actions Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedFans.length > 0 && (
                    <>
                      <span className="text-white text-sm font-medium">
                        {selectedFans.length} selected
                      </span>
                      <button
                        onClick={() => setShowEmailModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Email Selected
                      </button>
                      <button
                        onClick={() => setSelectedFans([])}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search fans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm"
                    />
                  </div>

                  {/* Filter */}
                  <select
                    value={filterSegment}
                    onChange={(e) => setFilterSegment(e.target.value)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm"
                  >
                    <option value="all">All Segments</option>
                    <option value="vip">VIP Fans</option>
                    <option value="regular">Regular Fans</option>
                    <option value="casual">Casual Fans</option>
                    <option value="new">New Fans</option>
                  </select>

                  {/* Export */}
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium text-sm transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Fans Table */}
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedFans.length === allFans.length}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-gray-700 bg-gray-900"
                          />
                        </th>
                        <th className="text-left text-gray-400 font-medium text-xs uppercase py-3 px-4">Fan</th>
                        <th className="text-left text-gray-400 font-medium text-xs uppercase py-3 px-4">Segment</th>
                        <th className="text-left text-gray-400 font-medium text-xs uppercase py-3 px-4">Events</th>
                        <th className="text-left text-gray-400 font-medium text-xs uppercase py-3 px-4">Total Spent</th>
                        <th className="text-left text-gray-400 font-medium text-xs uppercase py-3 px-4">Last Purchase</th>
                        <th className="text-left text-gray-400 font-medium text-xs uppercase py-3 px-4">Location</th>
                        <th className="text-right text-gray-400 font-medium text-xs uppercase py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFans.map((fan) => (
                        <tr key={fan.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                          <td className="py-4 px-4">
                            <input
                              type="checkbox"
                              checked={selectedFans.includes(fan.id)}
                              onChange={() => handleSelectFan(fan.id)}
                              className="w-4 h-4 rounded border-gray-700 bg-gray-900"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-xs">
                                  {fan.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm">{fan.name}</p>
                                <p className="text-gray-400 text-xs">{fan.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getSegmentColor(fan.segment)}`}>
                              {fan.segment}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-white text-sm">{fan.eventsAttended}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-white font-semibold text-sm">£{fan.totalSpent.toLocaleString()}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-400 text-sm">
                              {new Date(fan.lastPurchase).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-400 text-sm">{fan.location}</p>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredFans.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No fans found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Segments Tab */}
          {activeTab === 'segments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segments.map((segment) => (
                  <div
                    key={segment.id}
                    className={`bg-gradient-to-br from-${segment.color}-500/10 to-${segment.color}-600/10 border border-${segment.color}-500/20 rounded-xl p-6`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`text-${segment.color}-400 font-bold text-lg mb-1`}>{segment.name}</h3>
                        <p className="text-gray-400 text-sm">{segment.description}</p>
                      </div>
                      <Target className={`w-6 h-6 text-${segment.color}-400`} />
                    </div>
                    <div className="mb-4">
                      <p className={`text-${segment.color}-400 text-4xl font-bold`}>{segment.count.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {Math.round((segment.count / totalFans) * 100)}% of total audience
                      </p>
                    </div>
                    <button className={`w-full bg-${segment.color}-500/20 hover:bg-${segment.color}-500/30 text-${segment.color}-400 py-3 rounded-xl font-semibold text-sm transition-colors`}>
                      Email This Segment
                    </button>
                  </div>
                ))}
              </div>

              {/* Segment Insights */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">Segment Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">VIP Fans</p>
                      <p className="text-gray-400 text-xs">Generate 48% of total revenue despite being 6.6% of audience</p>
                    </div>
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">New Fans</p>
                      <p className="text-gray-400 text-xs">28.5% of new fans return for a second event within 60 days</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">Casual Fans</p>
                      <p className="text-gray-400 text-xs">Most likely to convert with targeted email campaigns (+35% conversion)</p>
                    </div>
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Tab */}
          {activeTab === 'engagement' && (
            <div className="space-y-6">
              {/* Engagement Trend */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">Engagement & Retention Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="month"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Engagement %"
                      />
                      <Line
                        type="monotone"
                        dataKey="retention"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Retention %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Engagement Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Email Campaigns</h3>
                      <p className="text-gray-400 text-sm">Last sent 8 days ago</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Send targeted emails to specific segments or all fans
                  </p>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Create Campaign
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Re-engagement</h3>
                      <p className="text-gray-400 text-sm">342 inactive fans</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Win back fans who haven't attended in 90+ days
                  </p>
                  <button className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                    Start Re-engagement
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full border border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Send Email Campaign</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">
                  Recipients
                </label>
                <div className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700">
                  {selectedFans.length > 0 ? `${selectedFans.length} selected fans` : 'All fans'}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter email subject..."
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">
                  Message
                </label>
                <textarea
                  placeholder="Write your message..."
                  rows={6}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  // Handle send
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}