import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestListEntryDto } from './dto/create-guest-list-entry.dto';
import { UpdateGuestListEntryDto } from './dto/update-guest-list-entry.dto';

@Injectable()
export class GuestListService {
  constructor(private prisma: PrismaService) {}

  private async assertOrganizer(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, organizerId: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only manage guest lists for your own events');
    }

    return event;
  }

  async create(eventId: string, userId: string, dto: CreateGuestListEntryDto) {
    await this.assertOrganizer(eventId, userId);

    return this.prisma.guestListEntry.create({
      data: {
        eventId,
        name: dto.name,
        email: dto.email ?? null,
        phone: dto.phone ?? null,
        notes: dto.notes ?? null,
        status: dto.status ?? 'INVITED',
      },
    });
  }

  async findAll(eventId: string, userId: string) {
    await this.assertOrganizer(eventId, userId);

    return this.prisma.guestListEntry.findMany({
      where: { eventId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(eventId: string, id: string, userId: string) {
    await this.assertOrganizer(eventId, userId);

    const entry = await this.prisma.guestListEntry.findFirst({
      where: { id, eventId },
    });

    if (!entry) {
      throw new NotFoundException('Guest list entry not found');
    }

    return entry;
  }

  async update(eventId: string, id: string, userId: string, dto: UpdateGuestListEntryDto) {
    await this.assertOrganizer(eventId, userId);

    const entry = await this.prisma.guestListEntry.findFirst({
      where: { id, eventId },
    });

    if (!entry) {
      throw new NotFoundException('Guest list entry not found');
    }

    return this.prisma.guestListEntry.update({
      where: { id },
      data: {
        name: dto.name ?? entry.name,
        email: dto.email ?? entry.email,
        phone: dto.phone ?? entry.phone,
        notes: dto.notes ?? entry.notes,
        status: dto.status ?? entry.status,
      },
    });
  }

  async remove(eventId: string, id: string, userId: string) {
    await this.assertOrganizer(eventId, userId);

    const entry = await this.prisma.guestListEntry.findFirst({
      where: { id, eventId },
    });

    if (!entry) {
      throw new NotFoundException('Guest list entry not found');
    }

    await this.prisma.guestListEntry.delete({
      where: { id },
    });

    return { message: 'Guest list entry deleted' };
  }
}
