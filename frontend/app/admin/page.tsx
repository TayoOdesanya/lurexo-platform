'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, Building2, Mic2, DollarSign } from 'lucide-react';
import StatCard from '../components/admin/StatCard';
import AlertCard from '../components/admin/AlertCard';
import PopularItemCard from '../components/admin/PopularItemCard';
import ActivityFeed from '../components/admin/ActivityFeed';
import RevenueChart from '../components/admin/charts/RevenueChart';
import EventCreationChart from '../components/admin/charts/EventCreationChart';
import UserGrowthChart from '../components/admin/charts/UserGrowthChart';
import type {
  ActivityItem,
  Alert,
  ChartDataPoint,
  PlatformStats,
  PopularArtist,
  PopularEvent,
  PopularOrganizer,
} from '../types/admin';

type AdminDashboardResponse = {
  platformStats: PlatformStats;
  alerts: Alert[];
  analytics: {
    revenueData: ChartDataPoint[];
    eventCreationData: ChartDataPoint[];
    userGrowthData: ChartDataPoint[];
    period: {
      start: string;
      end: string;
    };
  };
  popularEvents: PopularEvent[];
  popularOrganizers: PopularOrganizer[];
  popularArtists: PopularArtist[];
  activityFeed: ActivityItem[];
};

function formatGBP(amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `GBP ${safe.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/admin/dashboard', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(txt || `Failed to load admin dashboard (${res.status})`);
        }

        const json = (await res.json()) as AdminDashboardResponse;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load admin dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const platformStats: PlatformStats = data?.platformStats ?? {
    totalUsers: 0,
    totalOrganizers: 0,
    totalArtists: 0,
    totalRevenue: 0,
    changeVsPrevious: {
      users: 0,
      organizers: 0,
      artists: 0,
      revenue: 0,
    },
  };

  const alerts = data?.alerts ?? [];
  const revenueData = data?.analytics?.revenueData ?? [];
  const eventCreationData = data?.analytics?.eventCreationData ?? [];
  const userGrowthData = data?.analytics?.userGrowthData ?? [];
  const activityFeed = data?.activityFeed ?? [];

  const popularEventsFormatted = useMemo(
    () =>
      (data?.popularEvents ?? []).map((event) => ({
        id: event.id,
        name: event.name,
        metric: `${event.ticketsSold.toLocaleString()} tickets sold`,
        value: formatGBP(event.revenue),
      })),
    [data],
  );

  const popularOrganizersFormatted = useMemo(
    () =>
      (data?.popularOrganizers ?? []).map((organizer) => ({
        id: organizer.id,
        name: organizer.name,
        metric: `${organizer.eventsCount} events`,
        value: formatGBP(organizer.revenue),
      })),
    [data],
  );

  const popularArtistsFormatted = useMemo(
    () =>
      (data?.popularArtists ?? []).map((artist) => ({
        id: artist.id,
        name: artist.name,
        metric: `${artist.eventsCount} events, ${artist.ticketsSold.toLocaleString()} tickets`,
        value: formatGBP(artist.totalRevenue),
      })),
    [data],
  );

  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-8">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">
          {error}
        </div>
      </div>
    );
  }

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
          value={platformStats.totalUsers.toLocaleString()}
          change={platformStats.changeVsPrevious.users}
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Organizers"
          value={platformStats.totalOrganizers.toLocaleString()}
          change={platformStats.changeVsPrevious.organizers}
          icon={<Building2 className="w-6 h-6" />}
        />
        <StatCard
          title="Artists"
          value={platformStats.totalArtists.toLocaleString()}
          change={platformStats.changeVsPrevious.artists}
          icon={<Mic2 className="w-6 h-6" />}
        />
        <StatCard
          title="Total Revenue"
          value={formatGBP(platformStats.totalRevenue)}
          change={platformStats.changeVsPrevious.revenue}
          icon={<DollarSign className="w-6 h-6" />}
        />
      </div>

      {/* Alerts */}
      <AlertCard alerts={alerts} />

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">
            Trends & Analytics
          </h2>
        </div>

        {/* Revenue Chart - Full Width */}
        <RevenueChart data={revenueData} />

        {/* Event Creation & User Growth Charts - Side by Side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventCreationChart data={eventCreationData} />
          <UserGrowthChart data={userGrowthData} />
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
        <ActivityFeed activities={activityFeed} maxItems={10} />
      </div>
    </div>
  );
}
