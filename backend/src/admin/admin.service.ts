import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus, OrderStatus, ProfileType, UserRole } from '@prisma/client';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildWeekBuckets(count: number, endDate: Date) {
  const endWeekStart = startOfWeek(endDate);
  const firstWeekStart = new Date(endWeekStart);
  firstWeekStart.setDate(firstWeekStart.getDate() - 7 * (count - 1));

  const buckets: Array<{ start: Date; end: Date; label: string }> = [];
  let cursor = new Date(firstWeekStart);
  for (let i = 0; i < count; i += 1) {
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setDate(end.getDate() + 7);
    buckets.push({
      start,
      end,
      label: start.toISOString().slice(0, 10),
    });
    cursor.setDate(cursor.getDate() + 7);
  }

  return buckets;
}

function bucketIndex(date: Date, start: Date, count: number) {
  const diff = date.getTime() - start.getTime();
  if (diff < 0) return -1;
  const idx = Math.floor(diff / ONE_WEEK_MS);
  return idx >= count ? -1 : idx;
}

function percentChange(current: number, previous: number) {
  if (!previous) {
    return current ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

function formatUserName(user?: { firstName?: string | null; lastName?: string | null; email?: string | null }) {
  if (!user) return 'Unknown';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return name || user.email || 'Unknown';
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - 30);
    const previousStart = new Date(now);
    previousStart.setDate(previousStart.getDate() - 60);

    const [
      totalUsers,
      totalOrganizers,
      totalArtists,
      totalRevenueAgg,
      currentUsers,
      previousUsers,
      currentOrganizers,
      previousOrganizers,
      currentArtists,
      previousArtists,
      currentRevenueAgg,
      previousRevenueAgg,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.ORGANIZER } }),
      this.prisma.marketingAccount.count({ where: { accountType: ProfileType.ARTIST } }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: OrderStatus.COMPLETED },
      }),
      this.prisma.user.count({ where: { createdAt: { gte: currentStart } } }),
      this.prisma.user.count({ where: { createdAt: { gte: previousStart, lt: currentStart } } }),
      this.prisma.user.count({ where: { role: UserRole.ORGANIZER, createdAt: { gte: currentStart } } }),
      this.prisma.user.count({ where: { role: UserRole.ORGANIZER, createdAt: { gte: previousStart, lt: currentStart } } }),
      this.prisma.marketingAccount.count({ where: { accountType: ProfileType.ARTIST, createdAt: { gte: currentStart } } }),
      this.prisma.marketingAccount.count({
        where: { accountType: ProfileType.ARTIST, createdAt: { gte: previousStart, lt: currentStart } },
      }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: OrderStatus.COMPLETED, completedAt: { gte: currentStart } },
      }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: OrderStatus.COMPLETED, completedAt: { gte: previousStart, lt: currentStart } },
      }),
    ]);

    const totalRevenue = (totalRevenueAgg._sum.totalAmount || 0) / 100;
    const currentRevenue = (currentRevenueAgg._sum.totalAmount || 0) / 100;
    const previousRevenue = (previousRevenueAgg._sum.totalAmount || 0) / 100;

    const pendingEventsCount = await this.prisma.event.count({
      where: { status: EventStatus.DRAFT },
    });
    const pendingOrganizerCount = await this.prisma.user.count({
      where: { role: UserRole.ORGANIZER, organizerVerified: false },
    });

    const alerts = [
      pendingEventsCount > 0 && {
        id: 'events_pending',
        type: 'event_approval' as const,
        count: pendingEventsCount,
        message: 'Events Pending Approval',
        priority: pendingEventsCount > 10 ? 'high' : 'medium',
        link: '/admin/events/pending',
      },
      pendingOrganizerCount > 0 && {
        id: 'organizers_pending',
        type: 'organizer_verification' as const,
        count: pendingOrganizerCount,
        message: 'Organizers Pending Verification',
        priority: pendingOrganizerCount > 5 ? 'medium' : 'low',
        link: '/admin/organizers/pending-verification',
      },
    ].filter(Boolean);

    const weekBuckets = buildWeekBuckets(13, now);
    const weekStart = weekBuckets[0]?.start || startOfWeek(now);

    const [orders, events, users] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          status: OrderStatus.COMPLETED,
          completedAt: { gte: weekStart },
        },
        select: {
          id: true,
          completedAt: true,
          createdAt: true,
          totalAmount: true,
          orderNumber: true,
          buyerFirstName: true,
          buyerLastName: true,
          event: {
            select: {
              id: true,
              title: true,
              eventDate: true,
              organizerId: true,
              ticketsSold: true,
              organizer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  organizerName: true,
                  organizerCompanyName: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.event.findMany({
        where: { createdAt: { gte: weekStart } },
        select: {
          id: true,
          title: true,
          createdAt: true,
          eventDate: true,
          ticketsSold: true,
          totalRevenue: true,
          organizerId: true,
        },
      }),
      this.prisma.user.findMany({
        where: { createdAt: { gte: weekStart } },
        select: {
          id: true,
          createdAt: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      }),
    ]);

    const revenueSeries = new Array(weekBuckets.length).fill(0);
    orders.forEach((order) => {
      const date = order.completedAt || order.createdAt;
      const idx = bucketIndex(date, weekStart, weekBuckets.length);
      if (idx >= 0) {
        revenueSeries[idx] += order.totalAmount || 0;
      }
    });

    const eventSeries = new Array(weekBuckets.length).fill(0);
    events.forEach((event) => {
      const idx = bucketIndex(event.createdAt, weekStart, weekBuckets.length);
      if (idx >= 0) {
        eventSeries[idx] += 1;
      }
    });

    const usersInPeriod = users.map((user) => user.createdAt);
    const totalUsersBefore = totalUsers - usersInPeriod.length;
    const userSeriesAdds = new Array(weekBuckets.length).fill(0);
    usersInPeriod.forEach((createdAt) => {
      const idx = bucketIndex(createdAt, weekStart, weekBuckets.length);
      if (idx >= 0) {
        userSeriesAdds[idx] += 1;
      }
    });

    let running = totalUsersBefore;
    const userSeries = userSeriesAdds.map((count) => {
      running += count;
      return running;
    });

    const revenueData = weekBuckets.map((bucket, idx) => ({
      date: bucket.label,
      value: Math.round((revenueSeries[idx] || 0) / 100),
    }));
    const eventCreationData = weekBuckets.map((bucket, idx) => ({
      date: bucket.label,
      value: eventSeries[idx] || 0,
    }));
    const userGrowthData = weekBuckets.map((bucket, idx) => ({
      date: bucket.label,
      value: userSeries[idx] || 0,
    }));

    const recentOrders = orders
      .filter((order) => {
        const date = order.completedAt || order.createdAt;
        return date >= currentStart;
      })
      .sort((a, b) => {
        const aDate = (a.completedAt || a.createdAt).getTime();
        const bDate = (b.completedAt || b.createdAt).getTime();
        return bDate - aDate;
      });

    const popularEventMap = new Map<string, { id: string; name: string; ticketsSold: number; revenue: number; date: string }>();
    const popularOrganizerMap = new Map<string, { id: string; name: string; eventsCount: number; revenue: number }>();

    recentOrders.forEach((order) => {
      if (!order.event) return;
      const event = order.event;
      const eventRevenue = (order.totalAmount || 0) / 100;

      const existingEvent = popularEventMap.get(event.id) || {
        id: event.id,
        name: event.title,
        ticketsSold: event.ticketsSold || 0,
        revenue: 0,
        date: event.eventDate.toISOString(),
      };
      existingEvent.revenue += eventRevenue;
      popularEventMap.set(event.id, existingEvent);

      const organizer = event.organizer;
      if (organizer) {
        const organizerName =
          organizer.organizerName ||
          organizer.organizerCompanyName ||
          formatUserName(organizer);

        const existingOrg = popularOrganizerMap.get(organizer.id) || {
          id: organizer.id,
          name: organizerName,
          eventsCount: 0,
          revenue: 0,
        };
        existingOrg.revenue += eventRevenue;
        popularOrganizerMap.set(organizer.id, existingOrg);
      }
    });

    events.forEach((event) => {
      if (!event.organizerId) return;
      const entry = popularOrganizerMap.get(event.organizerId);
      if (entry) {
        entry.eventsCount += 1;
      }
    });

    const popularEvents = Array.from(popularEventMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    const popularOrganizers = Array.from(popularOrganizerMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)
      .map((org) => ({
        ...org,
        totalEvents: org.eventsCount,
      }));

    const artistAccounts = await this.prisma.marketingAccount.findMany({
      where: { accountType: ProfileType.ARTIST },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            organizerName: true,
            organizerCompanyName: true,
          },
        },
      },
    });

    const artistIds = artistAccounts.map((account) => account.userId);
    const artistEvents = artistIds.length
      ? await this.prisma.event.findMany({
          where: {
            organizerId: { in: artistIds },
            eventDate: { gte: currentStart },
          },
          select: {
            organizerId: true,
            ticketsSold: true,
            totalRevenue: true,
          },
        })
      : [];

    const artistStats = new Map<string, { eventsCount: number; ticketsSold: number; totalRevenue: number }>();
    artistEvents.forEach((event) => {
      const existing = artistStats.get(event.organizerId) || { eventsCount: 0, ticketsSold: 0, totalRevenue: 0 };
      existing.eventsCount += 1;
      existing.ticketsSold += event.ticketsSold || 0;
      existing.totalRevenue += (event.totalRevenue || 0) / 100;
      artistStats.set(event.organizerId, existing);
    });

    const popularArtists = artistAccounts
      .map((account) => {
        const stats = artistStats.get(account.userId) || { eventsCount: 0, ticketsSold: 0, totalRevenue: 0 };
        const name =
          account.user?.organizerName ||
          account.user?.organizerCompanyName ||
          formatUserName(account.user);
        return {
          id: account.userId,
          name,
          eventsCount: stats.eventsCount,
          ticketsSold: stats.ticketsSold,
          totalRevenue: stats.totalRevenue,
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 3);

    const activityStart = new Date(now.getTime() - 14 * ONE_DAY_MS);
    const [recentEvents, recentUsers, recentPayouts, recentPublished] = await Promise.all([
      this.prisma.event.findMany({
        where: { createdAt: { gte: activityStart } },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.user.findMany({
        where: { createdAt: { gte: activityStart } },
        select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.payout.findMany({
        where: { createdAt: { gte: activityStart } },
        select: { id: true, amount: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.event.findMany({
        where: { publishedAt: { gte: activityStart }, status: EventStatus.PUBLISHED },
        select: { id: true, title: true, publishedAt: true },
        orderBy: { publishedAt: 'desc' },
        take: 10,
      }),
    ]);

    const activityFeed = [
      ...recentEvents.map((event) => ({
        id: `event_created:${event.id}`,
        type: 'event_created' as const,
        message: `Event "${event.title}" created`,
        timestamp: event.createdAt.toISOString(),
      })),
      ...recentUsers.map((user) => ({
        id: `user_signup:${user.id}`,
        type: 'user_signup' as const,
        message: `New user signed up: ${formatUserName(user)}`,
        timestamp: user.createdAt.toISOString(),
        userId: user.id,
        userName: formatUserName(user),
      })),
      ...recentOrders.slice(0, 10).map((order) => ({
        id: `ticket_purchased:${order.id}`,
        type: 'ticket_purchased' as const,
        message: `Order ${order.orderNumber} completed`,
        timestamp: (order.completedAt || order.createdAt).toISOString(),
        userName: [order.buyerFirstName, order.buyerLastName].filter(Boolean).join(' ').trim(),
      })),
      ...recentPayouts.map((payout) => ({
        id: `payout_processed:${payout.id}`,
        type: 'payout_processed' as const,
        message: `Payout ${payout.status.toLowerCase()} for GBP ${(payout.amount || 0) / 100}`,
        timestamp: payout.createdAt.toISOString(),
      })),
      ...recentPublished.map((event) => ({
        id: `event_approved:${event.id}`,
        type: 'event_approved' as const,
        message: `Event "${event.title}" published`,
        timestamp: (event.publishedAt || new Date()).toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    return {
      platformStats: {
        totalUsers,
        totalOrganizers,
        totalArtists,
        totalRevenue,
        changeVsPrevious: {
          users: percentChange(currentUsers, previousUsers),
          organizers: percentChange(currentOrganizers, previousOrganizers),
          artists: percentChange(currentArtists, previousArtists),
          revenue: percentChange(currentRevenue, previousRevenue),
        },
      },
      alerts,
      analytics: {
        revenueData,
        eventCreationData,
        userGrowthData,
        period: {
          start: weekStart.toISOString(),
          end: now.toISOString(),
        },
      },
      popularEvents,
      popularOrganizers,
      popularArtists,
      activityFeed,
    };
  }
}
