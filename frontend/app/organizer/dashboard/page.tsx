'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Ticket,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  MoreVertical,
  ChevronRight,
  Plus,
  RefreshCw,
  Activity,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/organizer-login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="p-6 text-white">Loading…</div>;
  }

  return (
    <div>
      {/* your dashboard UI */}
    </div>
  );
}



type OrganizerDashboardResponse = {
  summary: {
    totalRevenue: number;
    totalTicketsSold: number;
    totalEvents: number;
    upcomingEvents: number;
  };
  events: Array<{
    id: string;
    title: string;
    eventDate: string;
    status: string;
    ticketsSold: number;
    capacity: number;
    revenue: number;
    completedOrders: number;
  }>;
};

function formatGBP(amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return safe.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatShortDate(dateString: string) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function OrganizerDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrganizerDashboardResponse | null>(null);

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

        const res = await fetch('/api/organizer/dashboard', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(txt || `Failed to load dashboard (${res.status})`);
        }

        const json = (await res.json()) as OrganizerDashboardResponse;

        if (!cancelled) {
          setData(json);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = data?.summary;

  const sortedEvents = useMemo(() => {
    const events = data?.events ?? [];
    return [...events].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  }, [data]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return (data?.events ?? [])
      .filter((e) => new Date(e.eventDate) > now)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(0, 6);
  }, [data]);

  // Chart data from real events (ordered oldest -> newest)
  const revenueSeries = useMemo(() => {
    const events = (data?.events ?? [])
      .slice()
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(-14);

    return events.map((e) => ({
      date: formatShortDate(e.eventDate),
      revenue: Number.isFinite(e.revenue) ? e.revenue : 0,
      tickets: Number.isFinite(e.ticketsSold) ? e.ticketsSold : 0,
      title: e.title,
    }));
  }, [data]);

  const warnings = useMemo(() => {
    if (!data) return [];

    const lowSales = sortedEvents
      .filter((e) => e.status?.toUpperCase() === 'PUBLISHED' || e.status?.toUpperCase() === 'ON_SALE')
      .filter((e) => e.capacity > 0 && (e.ticketsSold / e.capacity) < 0.15)
      .slice(0, 1);

    const drafts = sortedEvents.filter((e) => e.status?.toUpperCase() === 'DRAFT').slice(0, 1);

    const list: Array<{
      type: 'warning' | 'info' | 'success';
      title: string;
      description: string;
      action: string;
      actionLink: string;
    }> = [];

    if (lowSales.length) {
      const e = lowSales[0];
      list.push({
        type: 'warning',
        title: 'Sales need a push',
        description: `"${e.title}" is under 15% capacity sold. Consider an email blast or social post.`,
        action: 'Open Event',
        actionLink: `/organizer/manage-events/${e.id}`,
      });
    }

    if (drafts.length) {
      const e = drafts[0];
      list.push({
        type: 'info',
        title: 'Draft waiting to publish',
        description: `"${e.title}" is still a draft. Publish when ready to start selling.`,
        action: 'Edit Draft',
        actionLink: `/organizer/manage-events/${e.id}`,
      });
    }

    if ((summary?.upcomingEvents ?? 0) > 0) {
      list.push({
        type: 'success',
        title: 'You have upcoming events',
        description: `You’ve got ${summary?.upcomingEvents} upcoming event(s). Keep momentum with regular updates.`,
        action: 'Manage Events',
        actionLink: '/organizer/manage-events',
      });
    }

    return list.slice(0, 3);
  }, [data, sortedEvents, summary]);

  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Activity className="w-5 h-5 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500" />
            <p className="text-gray-300 text-sm">Loading your dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-white font-semibold mb-2">Dashboard unavailable</p>
          <p className="text-gray-400 text-sm mb-4">{error ?? 'No data returned.'}</p>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              Retry
            </button>
            <Link href="/organizer/manage-events">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                Manage Events
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">
          Welcome back, {user?.name ?? 'Organizer'} 👋
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Here’s what’s happening with your events
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Organizer ID: {user?.id ?? '—'}
        </p>
      </div>

      {/* Quick Stats (REAL DATA) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>Live</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Revenue</p>
          <p className="text-white font-bold text-xl sm:text-2xl">
            {formatGBP(summary?.totalRevenue ?? 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <div className="flex items-center gap-1 text-blue-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>Live</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Tickets Sold</p>
          <p className="text-white font-bold text-xl sm:text-2xl">
            {(summary?.totalTicketsSold ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Events</p>
          <p className="text-white font-bold text-xl sm:text-2xl">
            {summary?.totalEvents ?? 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Upcoming Events</p>
          <p className="text-white font-bold text-xl sm:text-2xl">
            {summary?.upcomingEvents ?? 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg sm:text-xl">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <Link
  href="/organizer/create-event"
  className="flex-1 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col items-center gap-2"
>
  <Plus className="w-5 h-5" />
  <span>Create Event</span>
</Link>


          <Link href="/organizer/manage-events" className="flex-1">
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col items-center gap-2">
              <Edit className="w-5 h-5" />
              <span>Manage Events</span>
            </button>
          </Link>

          <Link href="/organizer/analytics" className="flex-1">
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col items-center gap-2">
              <Activity className="w-5 h-5" />
              <span>Analytics</span>
            </button>
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Alerts + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Alerts */}
        <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h2 className="text-white font-bold text-lg sm:text-xl">Alerts & Recommendations</h2>
            </div>
            <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs font-semibold">
              {warnings.length}
            </span>
          </div>

          <div className="space-y-3">
            {warnings.length === 0 ? (
              <div className="bg-black/30 rounded-xl p-4 border border-gray-800">
                <p className="text-white font-semibold text-sm mb-1">All clear</p>
                <p className="text-gray-400 text-xs">No recommendations right now.</p>
              </div>
            ) : (
              warnings.map((w, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-3 sm:p-4 border ${
                    w.type === 'warning'
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : w.type === 'success'
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">{getWarningIcon(w.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm mb-1">{w.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mb-3">{w.description}</p>
                      <Link href={w.actionLink}>
                        <button
                          className={`text-xs sm:text-sm font-semibold flex items-center gap-1 ${
                            w.type === 'warning'
                              ? 'text-orange-400 hover:text-orange-300'
                              : w.type === 'success'
                              ? 'text-green-400 hover:text-green-300'
                              : 'text-blue-400 hover:text-blue-300'
                          } transition-colors`}
                        >
                          {w.action}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Revenue mini chart (REAL DATA derived from events) */}
        <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg sm:text-xl">Revenue Overview</h2>
            <span className="text-gray-400 text-xs sm:text-sm">Recent events</span>
          </div>

<div className="h-64 sm:h-72 flex items-center justify-center rounded-xl border border-gray-700 bg-gray-900/30 text-gray-300">
  <div className="text-center px-4">
    <div className="font-semibold">Chart temporarily disabled</div>
    <div className="text-sm text-gray-400 mt-1">
      Recharts + React navigation crash workaround
    </div>
  </div>
</div>


          {/* A small derived area chart for tickets (same real series) */}
{/* Tickets sold chart temporarily disabled */}
<div className="mt-4">
  <p className="text-gray-400 text-xs sm:text-sm mb-2">Tickets sold (same range)</p>
  <div className="h-20 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-900/30 text-gray-400 text-xs">
    Chart temporarily disabled
  </div>
</div>
        </div>
      </div>

      {/* Upcoming Events (REAL DATA) + Event List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Upcoming events */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <h2 className="text-white font-bold text-lg sm:text-xl">Upcoming Events</h2>
            </div>
            <Link href="/organizer/manage-events">
              <button className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium">
                View All
              </button>
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="bg-black/30 rounded-xl p-4 border border-gray-800">
              <p className="text-white font-semibold text-sm mb-1">No upcoming events</p>
              <p className="text-gray-400 text-xs mb-3">Create an event to start selling.</p>
<Link
  href="/organizer/create-event"
  className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
>
  Create Event
</Link>

            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const pct = event.capacity > 0 ? Math.round((event.ticketsSold / event.capacity) * 100) : 0;
                const status = (event.status || '').toUpperCase();
                const isOnSale = status === 'PUBLISHED' || status === 'ON_SALE';

                return (
                  <div key={event.id} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-1 truncate">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-gray-400 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(event.eventDate)}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                          isOnSale ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {status || '—'}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          {event.ticketsSold} / {event.capacity} sold
                        </span>
                        <span className="text-white font-semibold">{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-semibold text-sm">
                          {formatGBP(event.revenue)}
                        </span>
                        <span className="text-gray-500 text-xs">
                          • {event.completedOrders} completed order(s)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/organizer/manage-events/${event.id}`}>
                          <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link href={`/events/${event.id}`}>
                          <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
<Link
  href="/organizer/create-event"
  className="w-full mt-4 py-3 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl text-gray-400 hover:text-purple-400 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
>
  <Plus className="w-5 h-5" />
  Create New Event
</Link>
          
        </div>

        {/* All events (recent first) */}
        <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-base sm:text-lg">All Events</h2>
          </div>

          <div className="space-y-3">
            {sortedEvents.slice(0, 8).map((e) => {
              const status = (e.status || '').toUpperCase();
              const pct = e.capacity > 0 ? Math.round((e.ticketsSold / e.capacity) * 100) : 0;

              return (
                <div key={e.id} className="pb-3 border-b border-gray-800 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Ticket className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs sm:text-sm font-semibold truncate">{e.title}</p>
                      <p className="text-gray-500 text-xs">{formatDate(e.eventDate)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-400 text-xs">
                          {e.ticketsSold}/{e.capacity} • {pct}%
                        </span>
                        <span className="text-green-400 text-xs font-semibold">{formatGBP(e.revenue)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-500 text-xs">{status || '—'}</span>
                        <Link href={`/organizer/manage-events/${e.id}`}>
                          <span className="text-purple-400 hover:text-purple-300 text-xs font-semibold inline-flex items-center gap-1">
                            Manage <ChevronRight className="w-3 h-3" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/organizer/manage-events">
            <button className="w-full mt-4 text-center text-gray-400 hover:text-white text-xs font-medium py-2 transition-colors">
              View All Events
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
