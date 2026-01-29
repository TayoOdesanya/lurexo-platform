'use client';

import { Users, Building2, Mic2, DollarSign } from 'lucide-react';
import StatCard from '../components/admin/StatCard';
import AlertCard from '../components/admin/AlertCard';
import PopularItemCard from '../components/admin/PopularItemCard';
import ActivityFeed from '../components/admin/ActivityFeed';
import RevenueChart from '../components/admin/charts/RevenueChart';
import EventCreationChart from '../components/admin/charts/EventCreationChart';
import UserGrowthChart from '../components/admin/charts/UserGrowthChart';

// Import mock data
import {
  mockPlatformStats,
  mockAlerts,
  mockRevenueData,
  mockEventCreationData,
  mockUserGrowthData,
  mockPopularEvents,
  mockPopularOrganizers,
  mockPopularArtists,
  mockActivityFeed,
} from '../../lib/mockData/adminStats';

export default function AdminDashboard() {
  // Format popular items for PopularItemCard component
  const popularEventsFormatted = mockPopularEvents.map((event) => ({
    id: event.id,
    name: event.name,
    metric: `${event.ticketsSold.toLocaleString()} tickets sold`,
    value: `£${event.revenue.toLocaleString()}`,
  }));

  const popularOrganizersFormatted = mockPopularOrganizers.map((organizer) => ({
    id: organizer.id,
    name: organizer.name,
    metric: `${organizer.eventsCount} events`,
    value: `£${organizer.revenue.toLocaleString()}`,
  }));

  const popularArtistsFormatted = mockPopularArtists.map((artist) => ({
    id: artist.id,
    name: artist.name,
    metric: `${artist.eventsCount} events, ${artist.ticketsSold.toLocaleString()} tickets`,
    value: `£${artist.totalRevenue.toLocaleString()}`,
  }));

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-3xl" />
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Welcome back! Here's what's happening with Lurexo today.
          </p>
        </div>
      </div>

      {/* Platform Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={mockPlatformStats.totalUsers.toLocaleString()}
          change={mockPlatformStats.changeVsPrevious.users}
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Organizers"
          value={mockPlatformStats.totalOrganizers.toLocaleString()}
          change={mockPlatformStats.changeVsPrevious.organizers}
          icon={<Building2 className="w-6 h-6" />}
        />
        <StatCard
          title="Artists"
          value={mockPlatformStats.totalArtists.toLocaleString()}
          change={mockPlatformStats.changeVsPrevious.artists}
          icon={<Mic2 className="w-6 h-6" />}
        />
        <StatCard
          title="Total Revenue"
          value={`£${mockPlatformStats.totalRevenue.toLocaleString()}`}
          change={mockPlatformStats.changeVsPrevious.revenue}
          icon={<DollarSign className="w-6 h-6" />}
        />
      </div>

      {/* Alerts */}
      <AlertCard alerts={mockAlerts} />

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">
            Trends & Analytics
          </h2>
        </div>
        
        {/* Revenue Chart - Full Width */}
        <RevenueChart data={mockRevenueData} />
        
        {/* Event Creation & User Growth Charts - Side by Side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventCreationChart data={mockEventCreationData} />
          <UserGrowthChart data={mockUserGrowthData} />
        </div>
      </div>

      {/* Popular Items Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">
            Most Popular (Last 30 Days)
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Events */}
          <PopularItemCard
            title="Top Events"
            items={popularEventsFormatted}
            icon={<Users className="w-5 h-5 text-indigo-400" />}
          />
          
          {/* Top Organizers */}
          <PopularItemCard
            title="Top Organizers"
            items={popularOrganizersFormatted}
            icon={<Building2 className="w-5 h-5 text-purple-400" />}
          />
          
          {/* Top Artists */}
          <PopularItemCard
            title="Top Artists"
            items={popularArtistsFormatted}
            icon={<Mic2 className="w-5 h-5 text-rose-400" />}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">
            Recent Activity
          </h2>
        </div>
        <ActivityFeed activities={mockActivityFeed} maxItems={10} />
      </div>
    </div>
  );
}