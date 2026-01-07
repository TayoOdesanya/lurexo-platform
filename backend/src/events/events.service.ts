import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  /**
   * Creates an event and (optionally) uploads a cover image to Azure Blob Storage.
   * Controller passes coverImage from FileInterceptor('coverImage').
   */
  async create(
    organizerId: string,
    createEventDto: CreateEventDto,
    coverImage?: Express.Multer.File,
  ) {
    // Generate slug from title
    const slug = this.generateSlug(createEventDto.title);

    // Check if slug already exists (very unlikely because we add random suffix, but keep safety)
    const existingEvent = await this.prisma.event.findUnique({
      where: { slug },
    });

    if (existingEvent) {
      throw new BadRequestException(
        'An event with a similar title already exists',
      );
    }

    // Upload cover image (heroImage) first, so we can store the URL in DB
    let heroImageUrl = createEventDto.heroImage; // DTO requires a string; allow client to send placeholder
    let heroImageBlobName: string | null = null;

    if (coverImage?.buffer?.length) {
      try {
        const uploaded = await this.storage.uploadEventCoverImage(
          organizerId,
          coverImage,
        );
        heroImageUrl = uploaded.url;
        heroImageBlobName = uploaded.blobName;
      } catch (e) {
        throw new InternalServerErrorException('Failed to upload cover image');
      }
    }

    try {
      const event = await this.prisma.event.create({
        data: {
          ...createEventDto,
          slug,
          organizerId,
          // If you want drafts from the UI, keep this DRAFT.
          // If you want status to come from the UI, add status to DTO + validation.
          status: 'DRAFT',
          heroImage: heroImageUrl,
          galleryImages: createEventDto.galleryImages || [],
          // If you decide to store the blob name in DB later, add a column first.
          // heroImageBlobName: heroImageBlobName ?? undefined,
        },
        include: {
          organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              username: true,
              avatar: true,
              verified: true,
            },
          },
        },
      });

      // Transform organizer data like your other endpoints
      return {
        ...event,
        organizer: event.organizer
          ? {
              id: event.organizer.id,
              name: `${event.organizer.firstName} ${event.organizer.lastName}`,
              email: event.organizer.email,
              username: event.organizer.username,
              avatar: event.organizer.avatar,
              verified: event.organizer.verified,
            }
          : null,
      };
    } catch (e) {
      // Optional: if DB create fails after upload, you may want to delete the uploaded blob to avoid orphans.
      // if (heroImageBlobName) await this.storage.deleteBlob(heroImageBlobName).catch(() => undefined);
      throw e;
    }
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
            username: true,
            avatar: true,
            verified: true,
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

    return events.map((event) => ({
      ...event,
      organizer: event.organizer
        ? {
            id: event.organizer.id,
            name: `${event.organizer.firstName} ${event.organizer.lastName}`,
            username: event.organizer.username,
            avatar: event.organizer.avatar,
            verified: event.organizer.verified,
          }
        : null,
    }));
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
            username: true,
            avatar: true,
            verified: true,
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

    return {
      ...event,
      organizer: event.organizer
        ? {
            id: event.organizer.id,
            name: `${event.organizer.firstName} ${event.organizer.lastName}`,
            email: event.organizer.email,
            username: event.organizer.username,
            avatar: event.organizer.avatar,
            verified: event.organizer.verified,
          }
        : null,
    };
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
            username: true,
            avatar: true,
            verified: true,
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

    return {
      ...event,
      organizer: event.organizer
        ? {
            id: event.organizer.id,
            name: `${event.organizer.firstName} ${event.organizer.lastName}`,
            username: event.organizer.username,
            avatar: event.organizer.avatar,
            verified: event.organizer.verified,
          }
        : null,
    };
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

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }

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
            username: true,
            avatar: true,
            verified: true,
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

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    if (event.orders.length > 0) {
      throw new BadRequestException(
        'Cannot delete event with completed orders. Cancel the event instead.',
      );
    }

    // Optional: if you add blob-name storage later, delete the blob here too.

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

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only cancel your own events');
    }

    const cancelledEvent = await this.prisma.event.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return cancelledEvent;
  }

  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${randomSuffix}`;
  }
}
