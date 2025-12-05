import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';
import { UpdateTicketTierDto } from './dto/update-ticket-tier.dto';

@Injectable()
export class TicketTiersService {
  constructor(private prisma: PrismaService) {}

  async create(eventId: string, userId: string, createTicketTierDto: CreateTicketTierDto) {
    // Check if event exists and user is the organizer
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only add ticket tiers to your own events');
    }

    // Check if total quantity of all tiers would exceed event capacity
    const existingTiers = await this.prisma.ticketTier.findMany({
      where: { eventId },
    });

    const totalExistingQuantity = existingTiers.reduce((sum, tier) => sum + tier.quantity, 0);
    const newTotalQuantity = totalExistingQuantity + createTicketTierDto.quantity;

    if (newTotalQuantity > event.totalCapacity) {
      throw new BadRequestException(
        `Total ticket quantity (${newTotalQuantity}) exceeds event capacity (${event.totalCapacity})`,
      );
    }

    const ticketTier = await this.prisma.ticketTier.create({
      data: {
        ...createTicketTierDto,
        eventId,
      },
    });

    return ticketTier;
  }

  async findAllByEvent(eventId: string) {
    const tiers = await this.prisma.ticketTier.findMany({
      where: { eventId },
      orderBy: { displayOrder: 'asc' },
    });

    return tiers;
  }

  async findOne(id: string) {
    const tier = await this.prisma.ticketTier.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            organizerId: true,
          },
        },
      },
    });

    if (!tier) {
      throw new NotFoundException('Ticket tier not found');
    }

    return tier;
  }

  async update(id: string, userId: string, updateTicketTierDto: UpdateTicketTierDto) {
    const tier = await this.prisma.ticketTier.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!tier) {
      throw new NotFoundException('Ticket tier not found');
    }

    if (tier.event.organizerId !== userId) {
      throw new ForbiddenException('You can only update ticket tiers for your own events');
    }

    // If updating quantity, check it doesn't exceed event capacity
    if (updateTicketTierDto.quantity) {
      const otherTiers = await this.prisma.ticketTier.findMany({
        where: {
          eventId: tier.eventId,
          id: { not: id },
        },
      });

      const totalOtherQuantity = otherTiers.reduce((sum, t) => sum + t.quantity, 0);
      const newTotalQuantity = totalOtherQuantity + updateTicketTierDto.quantity;

      if (newTotalQuantity > tier.event.totalCapacity) {
        throw new BadRequestException(
          `Total ticket quantity (${newTotalQuantity}) exceeds event capacity (${tier.event.totalCapacity})`,
        );
      }

      // Can't reduce quantity below already sold
      if (updateTicketTierDto.quantity < tier.quantitySold) {
        throw new BadRequestException(
          `Cannot reduce quantity below already sold tickets (${tier.quantitySold})`,
        );
      }
    }

    const updatedTier = await this.prisma.ticketTier.update({
      where: { id },
      data: updateTicketTierDto,
    });

    return updatedTier;
  }

  async remove(id: string, userId: string) {
    const tier = await this.prisma.ticketTier.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!tier) {
      throw new NotFoundException('Ticket tier not found');
    }

    if (tier.event.organizerId !== userId) {
      throw new ForbiddenException('You can only delete ticket tiers for your own events');
    }

    // Can't delete if tickets have been sold
    if (tier.quantitySold > 0) {
      throw new BadRequestException(
        `Cannot delete ticket tier with ${tier.quantitySold} sold tickets. Hide it instead.`,
      );
    }

    await this.prisma.ticketTier.delete({
      where: { id },
    });

    return { message: 'Ticket tier deleted successfully' };
  }
}
