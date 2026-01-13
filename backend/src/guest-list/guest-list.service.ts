import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestListService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all guests for a specific event
   */
  async findAllByEvent(eventId: string) {
    // First check if event exists and has guest list enabled
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { enableGuestList: true, maxGuests: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.enableGuestList) {
      throw new BadRequestException('Guest list is not enabled for this event');
    }

    // Get all guests for the event
    const guests = await this.prisma.guest.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      guests,
      maxGuests: event.maxGuests,
      currentCount: guests.length,
    };
  }

  /**
   * Create a new guest
   */
  async create(eventId: string, createGuestDto: CreateGuestDto) {
    // Check if event exists and has guest list enabled
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { enableGuestList: true, maxGuests: true, title: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.enableGuestList) {
      throw new BadRequestException('Guest list is not enabled for this event');
    }

    // Check if max guests limit reached
    if (event.maxGuests) {
      const currentGuestCount = await this.prisma.guest.count({
        where: { eventId },
      });

      if (currentGuestCount >= event.maxGuests) {
        throw new BadRequestException('Guest list is full');
      }
    }

    // Check if email already exists for this event
    const existingGuest = await this.prisma.guest.findFirst({
      where: {
        eventId,
        email: createGuestDto.email,
      },
    });

    if (existingGuest) {
      throw new BadRequestException('Guest with this email already exists for this event');
    }

    // Generate unique ticket code
    const guestCount = await this.prisma.guest.count({ where: { eventId } });
    const ticketCode = `GL-${createGuestDto.category.substring(0, 3).toUpperCase()}-${String(guestCount + 1).padStart(3, '0')}`;
    
    // Generate ticket link (you can customize this URL)
    const ticketLink = `${process.env.FRONTEND_URL || 'https://lurexo.com'}/tickets/${ticketCode}`;

    // Create the guest
    const guest = await this.prisma.guest.create({
      data: {
        eventId,
        name: createGuestDto.name,
        email: createGuestDto.email,
        mobile: createGuestDto.mobile,
        category: createGuestDto.category,
        notes: createGuestDto.notes,
        ticketCode,
        ticketLink,
        invitedAt: new Date(),
      },
    });

    return guest;
  }

  /**
   * Get a single guest
   */
  async findOne(eventId: string, guestId: string) {
    const guest = await this.prisma.guest.findFirst({
      where: {
        id: guestId,
        eventId,
      },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    return guest;
  }

  /**
   * Update a guest
   */
  async update(eventId: string, guestId: string, updateGuestDto: UpdateGuestDto) {
    // Check if guest exists
    const existingGuest = await this.prisma.guest.findFirst({
      where: {
        id: guestId,
        eventId,
      },
    });

    if (!existingGuest) {
      throw new NotFoundException('Guest not found');
    }

    // If email is being updated, check for duplicates
    if (updateGuestDto.email && updateGuestDto.email !== existingGuest.email) {
      const duplicateGuest = await this.prisma.guest.findFirst({
        where: {
          eventId,
          email: updateGuestDto.email,
          id: { not: guestId },
        },
      });

      if (duplicateGuest) {
        throw new BadRequestException('Guest with this email already exists for this event');
      }
    }

    // Update timestamps based on status
    const updateData: any = { ...updateGuestDto };
    
    if (updateGuestDto.status === 'CONFIRMED' && !existingGuest.confirmedAt) {
      updateData.confirmedAt = new Date();
    }
    
    if (updateGuestDto.status === 'CHECKED_IN' && !existingGuest.checkedInAt) {
      updateData.checkedInAt = new Date();
    }

    const guest = await this.prisma.guest.update({
      where: { id: guestId },
      data: updateData,
    });

    return guest;
  }

  /**
   * Delete a guest
   */
  async remove(eventId: string, guestId: string) {
    // Check if guest exists
    const existingGuest = await this.prisma.guest.findFirst({
      where: {
        id: guestId,
        eventId,
      },
    });

    if (!existingGuest) {
      throw new NotFoundException('Guest not found');
    }

    await this.prisma.guest.delete({
      where: { id: guestId },
    });

    return { message: 'Guest removed successfully' };
  }

  /**
   * Send invitation to a guest
   */
  async sendInvitation(eventId: string, guestId: string) {
    const guest = await this.findOne(eventId, guestId);

    // TODO: Integrate with your email service
    // For now, we'll just return a success message
    console.log(`Sending invitation to ${guest.email} for guest ${guest.name}`);

    return {
      message: 'Invitation sent successfully',
      sentTo: guest.email,
    };
  }
}