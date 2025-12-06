import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferResponse } from './dto/respond-transfer.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TicketTransfersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createTransfer(userId: string, createTransferDto: CreateTransferDto) {
    const { ticketId, recipientEmail, message } = createTransferDto;

    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: true,
        order: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.currentOwnerId !== userId) {
      throw new ForbiddenException('You can only transfer tickets you own');
    }

    if (ticket.status !== 'VALID') {
      throw new BadRequestException(`Ticket status is ${ticket.status} and cannot be transferred`);
    }

    if (ticket.event.status === 'CANCELLED') {
      throw new BadRequestException('Cannot transfer tickets for cancelled events');
    }

    if (new Date() > ticket.event.eventDate) {
      throw new BadRequestException('Cannot transfer tickets for past events');
    }

    const existingTransfer = await this.prisma.ticketTransfer.findFirst({
      where: {
        ticketId,
        status: 'PENDING',
      },
    });

    if (existingTransfer) {
      throw new BadRequestException('This ticket already has a pending transfer');
    }

    const sender = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (sender.email === recipientEmail) {
      throw new BadRequestException('Cannot transfer ticket to yourself');
    }

    const transferToken = uuidv4();
    const expiryDays = this.configService.get<number>('TICKET_TRANSFER_EXPIRY_DAYS') || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const recipientUser = await this.prisma.user.findUnique({
      where: { email: recipientEmail },
    });

    const transfer = await this.prisma.ticketTransfer.create({
      data: {
        ticketId,
        senderId: userId,
        receiverId: recipientUser?.id,
        recipientEmail,
        transferToken,
        message,
        status: 'PENDING',
        expiresAt,
      },
      include: {
        ticket: {
          include: {
            event: true,
            tier: true,
          },
        },
        sender: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const transferLink = `${this.configService.get('FRONTEND_URL')}/transfer/${transferToken}`;

    return {
      transfer,
      transferLink,
      message: 'Transfer created successfully. Recipient will receive an email with instructions.',
    };
  }

  async respondToTransfer(transferToken: string, userId: string, response: TransferResponse) {
    const transfer = await this.prisma.ticketTransfer.findUnique({
      where: { transferToken },
      include: {
        ticket: {
          include: {
            event: true,
            tier: true,
          },
        },
        sender: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    if (transfer.status !== 'PENDING') {
      throw new BadRequestException(`Transfer is already ${transfer.status.toLowerCase()}`);
    }

    if (new Date() > transfer.expiresAt) {
      await this.prisma.ticketTransfer.update({
        where: { id: transfer.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('Transfer has expired');
    }

    const recipient = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (recipient.email !== transfer.recipientEmail) {
      throw new ForbiddenException('You are not the intended recipient of this transfer');
    }

    if (response === TransferResponse.ACCEPT) {
      const result = await this.prisma.$transaction([
        this.prisma.ticketTransfer.update({
          where: { id: transfer.id },
          data: {
            status: 'ACCEPTED',
            receiverId: userId,
            acceptedAt: new Date(),
          },
        }),

        this.prisma.ticket.update({
          where: { id: transfer.ticketId },
          data: {
            currentOwnerId: userId,
            status: 'VALID',
          },
        }),
      ]);

      return {
        message: 'Transfer accepted successfully. Ticket is now in your account.',
        transfer: result[0],
      };
    } else {
      const result = await this.prisma.$transaction([
        this.prisma.ticketTransfer.update({
          where: { id: transfer.id },
          data: { status: 'REJECTED' },
        }),

        this.prisma.ticket.update({
          where: { id: transfer.ticketId },
          data: {
            status: 'VALID',
          },
        }),
      ]);

      return {
        message: 'Transfer rejected. Ticket returned to original owner.',
        transfer: result[0],
      };
    }
  }

  async getTransferByToken(transferToken: string) {
    const transfer = await this.prisma.ticketTransfer.findUnique({
      where: { transferToken },
      include: {
        ticket: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                eventDate: true,
                venue: true,
                heroImage: true,
              },
            },
            tier: {
              select: {
                name: true,
              },
            },
          },
        },
        sender: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    return transfer;
  }

  async getUserTransfers(userId: string) {
    const [sent, received] = await Promise.all([
      this.prisma.ticketTransfer.findMany({
        where: { senderId: userId },
        include: {
          ticket: {
            include: {
              event: {
                select: {
                  title: true,
                  eventDate: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.ticketTransfer.findMany({
        where: { recipientEmail: userId },
        include: {
          ticket: {
            include: {
              event: {
                select: {
                  title: true,
                  eventDate: true,
                },
              },
            },
          },
          sender: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { sent, received };
  }

  async cancelTransfer(transferId: string, userId: string) {
    const transfer = await this.prisma.ticketTransfer.findUnique({
      where: { id: transferId },
      include: { ticket: true },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    if (transfer.senderId !== userId) {
      throw new ForbiddenException('You can only cancel transfers you initiated');
    }

    if (transfer.status !== 'PENDING') {
      throw new BadRequestException('Only pending transfers can be cancelled');
    }

    const result = await this.prisma.$transaction([
      this.prisma.ticketTransfer.update({
        where: { id: transferId },
        data: { status: 'CANCELLED' },
      }),

      this.prisma.ticket.update({
        where: { id: transfer.ticketId },
        data: { status: 'VALID' },
      }),
    ]);

    return {
      message: 'Transfer cancelled successfully',
      transfer: result[0],
    };
  }
}
