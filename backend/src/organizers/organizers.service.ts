import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus, UserRole } from '@prisma/client';

@Injectable()
export class OrganizersService {
  constructor(private readonly prisma: PrismaService) {}

  async findProfile(idOrUsername: string) {
    const organizer = await this.prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [
              { id: idOrUsername },
              { organizerUsername: idOrUsername },
              { username: idOrUsername },
            ],
          },
          { role: { in: [UserRole.ORGANIZER, UserRole.ADMIN] } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        organizerName: true,
        organizerUsername: true,
        organizerAvatar: true,
        organizerVerified: true,
        username: true,
        avatar: true,
        verified: true,
      },
    });

    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    const events = await this.prisma.event.findMany({
      where: {
        organizerId: organizer.id,
        status: EventStatus.PUBLISHED,
      },
      orderBy: { eventDate: 'asc' },
      select: {
        id: true,
        title: true,
        category: true,
        eventDate: true,
        venue: true,
        city: true,
        address: true,
        country: true,
        heroImage: true,
        ticketsSold: true,
        totalCapacity: true,
        ticketTiers: {
          where: { status: 'ACTIVE' },
          select: { price: true },
        },
      },
    });

    const name =
      organizer.organizerName ||
      [organizer.firstName, organizer.lastName].filter(Boolean).join(' ') ||
      'Organizer';

    const username = organizer.organizerUsername || organizer.username || '';
    const avatar = organizer.organizerAvatar || organizer.avatar || null;
    const verified = organizer.organizerVerified ?? organizer.verified ?? false;

    const stats = {
      eventsHosted: events.length,
      ticketsSold: events.reduce((sum, event) => sum + (event.ticketsSold ?? 0), 0),
      totalCapacity: events.reduce((sum, event) => sum + (event.totalCapacity ?? 0), 0),
    };

    return {
      organizer: {
        id: organizer.id,
        name,
        username,
        avatar,
        verified,
      },
      stats,
      events,
    };
  }
}
