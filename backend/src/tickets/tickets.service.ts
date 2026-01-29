import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScanTicketDto } from './dto/scan-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async scanTicket(userId: string, payload: ScanTicketDto) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { qrCode: payload.qrCode },
      include: {
        tier: true,
        currentOwner: true,
        event: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (payload.eventId && ticket.eventId !== payload.eventId) {
      throw new BadRequestException('Ticket does not belong to this event');
    }

    if (ticket.status === 'USED') {
      return {
        status: 'already_scanned',
        ticket: {
          id: ticket.id,
          qrCode: ticket.qrCode,
          ticketNumber: ticket.ticketNumber,
          status: ticket.status,
          scannedAt: ticket.scannedAt,
          eventId: ticket.eventId,
          eventTitle: ticket.event.title,
          tierName: ticket.tier.name,
          holderName: `${ticket.currentOwner.firstName ?? ''} ${ticket.currentOwner.lastName ?? ''}`.trim(),
          holderEmail: ticket.currentOwner.email,
        },
      };
    }

    if (ticket.status !== 'VALID') {
      throw new BadRequestException(`Ticket status is ${ticket.status} and cannot be scanned`);
    }

    const scannedAt = new Date();
    const updated = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'USED',
        scannedAt,
        scannedBy: userId,
      },
    });

    return {
      status: 'scanned',
      ticket: {
        id: updated.id,
        qrCode: updated.qrCode,
        ticketNumber: updated.ticketNumber,
        status: updated.status,
        scannedAt: updated.scannedAt,
        eventId: ticket.eventId,
        eventTitle: ticket.event.title,
        tierName: ticket.tier.name,
        holderName: `${ticket.currentOwner.firstName ?? ''} ${ticket.currentOwner.lastName ?? ''}`.trim(),
        holderEmail: ticket.currentOwner.email,
      },
    };
  }
}
