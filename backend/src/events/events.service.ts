import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(organizerId: string, createEventDto: CreateEventDto) {
    // Generate slug from title
    const slug = this.generateSlug(createEventDto.title);

    // Check if slug already exists
    const existingEvent = await this.prisma.event.findUnique({
      where: { slug },
    });

    if (existingEvent) {
      throw new BadRequestException('An event with a similar title already exists');
    }

    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        slug,
        organizerId,
        status: 'DRAFT',
        galleryImages: createEventDto.galleryImages || [],
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return event;
  }

  async findAll(filters?: {
    status?: EventStatus;
    category?: string;
    search?: string;
    city?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    } else {
      // Default to showing only published events
      where.status = 'PUBLISHED';
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { venue: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const events = await this.prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        ticketTiers: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
            quantitySold: true,
          },
        },
      },
      orderBy: { eventDate: 'asc' },
    });

    return events;
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        ticketTiers: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        ticketTiers: {
          where: { status: 'ACTIVE' },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async findByOrganizer(organizerId: string) {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
      include: {
        ticketTiers: {
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
            quantitySold: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return events;
  }

  async update(id: string, userId: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if user is the organizer
    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }

    // If publishing, set publishedAt timestamp
    const updateData: any = { ...updateEventDto };
    if (updateEventDto.status === 'PUBLISHED' && event.status === 'DRAFT') {
      updateData.publishedAt = new Date();
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        ticketTiers: true,
      },
    });

    return updatedEvent;
  }

  async remove(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        orders: { where: { status: 'COMPLETED' } },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if user is the organizer
    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    // Don't allow deletion if there are completed orders
    if (event.orders.length > 0) {
      throw new BadRequestException(
        'Cannot delete event with completed orders. Cancel the event instead.',
      );
    }

    await this.prisma.event.delete({
      where: { id },
    });

    return { message: 'Event deleted successfully' };
  }

  async cancel(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if user is the organizer
    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only cancel your own events');
    }

    const cancelledEvent = await this.prisma.event.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // TODO: Notify all ticket holders about cancellation
    // TODO: Process refunds

    return cancelledEvent;
  }

  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Add random suffix to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${randomSuffix}`;
  }
}
