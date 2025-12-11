import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getEventAnalytics(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: true,
        ticketTiers: true,
        orders: {
          where: { status: 'COMPLETED' },
        },
        tickets: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only view analytics for your own events');
    }

    // Calculate metrics
    const totalTicketsSold = event.ticketsSold;
    const totalRevenue = event.totalRevenue / 100; // Convert to pounds
    const organizerRevenue = event.organizerRevenue / 100;
    const platformRevenue = event.platformRevenue / 100;
    const averageTicketPrice = totalTicketsSold > 0 ? totalRevenue / totalTicketsSold : 0;

    // Sales by tier
    const salesByTier = event.ticketTiers.map((tier) => ({
      tierId: tier.id,
      tierName: tier.name,
      price: tier.price / 100,
      quantity: tier.quantity,
      sold: tier.quantitySold,
      remaining: tier.quantity - tier.quantitySold,
      soldPercentage: (tier.quantitySold / tier.quantity) * 100,
      revenue: (tier.price * tier.quantitySold) / 100,
    }));

    // Sales over time (by day)
    const salesOverTime = await this.getSalesOverTime(eventId);

    // Order status breakdown
    const orderStatusBreakdown = await this.prisma.order.groupBy({
      by: ['status'],
      where: { eventId },
      _count: true,
    });

    // Recent orders
    const recentOrders = await this.prisma.order.findMany({
      where: {
        eventId,
        status: 'COMPLETED',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    // Capacity metrics
    const capacityUsed = (totalTicketsSold / event.totalCapacity) * 100;
    const capacityRemaining = event.totalCapacity - totalTicketsSold;

    // Payment method breakdown
    const paymentMethods = await this.prisma.order.groupBy({
      by: ['paymentMethod'],
      where: {
        eventId,
        status: 'COMPLETED',
      },
      _count: true,
    });

    return {
      event: {
        id: event.id,
        title: event.title,
        eventDate: event.eventDate,
        venue: event.venue,
        status: event.status,
        totalCapacity: event.totalCapacity,
      },
      revenue: {
        total: totalRevenue,
        organizer: organizerRevenue,
        platform: platformRevenue,
        averageTicketPrice,
      },
      tickets: {
        sold: totalTicketsSold,
        capacity: event.totalCapacity,
        remaining: capacityRemaining,
        capacityUsedPercentage: capacityUsed,
      },
      salesByTier,
      salesOverTime,
      orderStatusBreakdown: orderStatusBreakdown.map((item) => ({
        status: item.status,
        count: item._count,
      })),
      paymentMethods: paymentMethods.map((item) => ({
        method: item.paymentMethod || 'unknown',
        count: item._count,
      })),
      recentOrders: recentOrders.map((order) => ({
        orderNumber: order.orderNumber,
        buyer: `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email,
        amount: order.totalAmount / 100,
        completedAt: order.completedAt,
      })),
    };
  }

  async getOrganizerDashboard(userId: string) {
    const events = await this.prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        ticketTiers: true,
        _count: {
          select: {
            orders: {
              where: { status: 'COMPLETED' },
            },
          },
        },
      },
      orderBy: { eventDate: 'desc' },
    });

    const totalRevenue = events.reduce((sum, event) => sum + event.organizerRevenue, 0) / 100;
    const totalTicketsSold = events.reduce((sum, event) => sum + event.ticketsSold, 0);
    const totalEvents = events.length;
    const upcomingEvents = events.filter((e) => e.eventDate > new Date()).length;

    const eventSummaries = events.map((event) => ({
      id: event.id,
      title: event.title,
      eventDate: event.eventDate,
      status: event.status,
      ticketsSold: event.ticketsSold,
      capacity: event.totalCapacity,
      revenue: event.organizerRevenue / 100,
      completedOrders: event._count.orders,
    }));

    return {
      summary: {
        totalRevenue,
        totalTicketsSold,
        totalEvents,
        upcomingEvents,
      },
      events: eventSummaries,
    };
  }

  async getAttendeeList(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only view attendees for your own events');
    }

    const tickets = await this.prisma.ticket.findMany({
      where: {
        eventId,
        status: { in: ['VALID', 'USED'] },
      },
      include: {
        currentOwner: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tier: {
          select: {
            name: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
            completedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      eventId,
      eventTitle: event.title,
      totalAttendees: tickets.length,
      attendees: tickets.map((ticket) => ({
        ticketNumber: ticket.ticketNumber,
        attendeeName: `${ticket.currentOwner.firstName} ${ticket.currentOwner.lastName}`,
        email: ticket.currentOwner.email,
        ticketType: ticket.tier.name,
        purchaseDate: ticket.order.completedAt,
        status: ticket.status,
        scannedAt: ticket.scannedAt,
      })),
    };
  }

  private async getSalesOverTime(eventId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        eventId,
        status: 'COMPLETED',
      },
      select: {
        completedAt: true,
        totalAmount: true,
      },
      orderBy: { completedAt: 'asc' },
    });

    const salesByDay: Record<string, { date: string; revenue: number; tickets: number }> = {};

    orders.forEach((order) => {
      const date = order.completedAt.toISOString().split('T')[0];
      if (!salesByDay[date]) {
        salesByDay[date] = { date, revenue: 0, tickets: 0 };
      }
      salesByDay[date].revenue += order.totalAmount / 100;
      salesByDay[date].tickets += 1;
    });

    return Object.values(salesByDay);
  }
}
