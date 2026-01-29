import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CompleteOrderDto } from './dto/complete-order.dto';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    });
  }

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { eventId, items, buyerEmail, buyerFirstName, buyerLastName } = createOrderDto;

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { ticketTiers: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== 'PUBLISHED') {
      throw new BadRequestException('Event is not available for ticket purchase');
    }

    const now = new Date();
    if (now < event.saleStartDate || now > event.saleEndDate) {
      throw new BadRequestException('Ticket sales are not currently active for this event');
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const tier = event.ticketTiers.find((t) => t.id === item.tierId);

      if (!tier) {
        throw new NotFoundException(`Ticket tier ${item.tierId} not found`);
      }

      if (tier.status !== 'ACTIVE') {
        throw new BadRequestException(`Ticket tier ${tier.name} is not available`);
      }

      const availableQuantity = tier.quantity - tier.quantitySold;
      if (item.quantity > availableQuantity) {
        throw new BadRequestException(
          `Only ${availableQuantity} tickets available for ${tier.name}`,
        );
      }

      if (item.quantity > tier.maxPerOrder) {
        throw new BadRequestException(
          `Maximum ${tier.maxPerOrder} tickets allowed per order for ${tier.name}`,
        );
      }

      const itemTotal = tier.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        tier,
        quantity: item.quantity,
        itemTotal,
      });
    }

    const serviceFeePercentage = this.configService.get<number>('STRIPE_SERVICE_FEE_PERCENTAGE') || 4;
    const serviceFee = Math.round(subtotal * (serviceFeePercentage / 100));
    const totalAmount = subtotal + serviceFee;

    const orderNumber = `LRX-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'gbp',
      metadata: {
        eventId,
        userId,
        orderNumber,
        eventTitle: event.title,
      },
      description: `Tickets for ${event.title}`,
    });

    const order = await this.prisma.order.create({
      data: {
        userId,
        eventId,
        orderNumber,
        status: 'PENDING',
        subtotal,
        serviceFee,
        totalAmount,
        stripePaymentIntentId: paymentIntent.id,
        buyerEmail,
        buyerFirstName,
        buyerLastName,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            eventDate: true,
            venue: true,
          },
        },
      },
    });

    return {
      order,
      clientSecret: paymentIntent.client_secret,
      publishableKey: this.configService.get('STRIPE_PUBLISHABLE_KEY'),
    };
  }

  async handlePaymentSuccess(paymentIntentId: string) {
    const order = await this.prisma.order.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
      include: {
        event: {
          include: {
            ticketTiers: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'COMPLETED') {
      return order;
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment has not succeeded');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          stripeChargeId: paymentIntent.latest_charge as string,
          paymentMethod: paymentIntent.payment_method_types[0],
        },
      });

      const tickets = [];
      const tier = order.event.ticketTiers[0];
      
      for (let i = 0; i < 2; i++) {
        const ticketNumber = `${order.orderNumber}-T${i + 1}`;
        const qrToken = await this.generateQRToken(order.id, ticketNumber);

        const ticket = await tx.ticket.create({
          data: {
            orderId: order.id,
            eventId: order.eventId,
            tierId: tier.id,
            currentOwnerId: order.userId,
            originalOwnerId: order.userId,
            ticketNumber,
            qrCode: qrToken,
            faceValue: tier.price,
            pricePaid: tier.price + Math.round(order.serviceFee / 2),
            status: 'VALID',
          },
        });

        tickets.push(ticket);
      }

      await tx.ticketTier.update({
        where: { id: tier.id },
        data: {
          quantitySold: { increment: 2 },
        },
      });

      const organizerRevenue = order.subtotal;
      const platformRevenue = order.serviceFee;

      await tx.event.update({
        where: { id: order.eventId },
        data: {
          ticketsSold: { increment: 2 },
          totalRevenue: { increment: order.totalAmount },
          organizerRevenue: { increment: organizerRevenue },
          platformRevenue: { increment: platformRevenue },
        },
      });

      return { updatedOrder, tickets };
    });

    return result;
  }

  async findUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
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
        tickets: {
          select: {
            id: true,
            ticketNumber: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }

  async findOne(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        event: true,
        tickets: {
          include: {
            tier: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }

  async completeOrderManual(orderId: string, userId: string, completeOrderDto: CompleteOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        event: {
          include: {
            ticketTiers: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You can only complete your own orders');
    }

    if (order.status === 'COMPLETED') {
      return {
        order,
        tickets: await this.prisma.ticket.findMany({ where: { orderId: order.id } }),
      };
    }

    let subtotal = 0;
    const itemsWithTier = completeOrderDto.items.map((item) => {
      const tier = order.event.ticketTiers.find((t) => t.id === item.tierId);
      if (!tier) {
        throw new NotFoundException(`Ticket tier ${item.tierId} not found`);
      }
      if (tier.status !== 'ACTIVE') {
        throw new BadRequestException(`Ticket tier ${tier.name} is not available`);
      }
      const availableQuantity = tier.quantity - tier.quantitySold;
      if (item.quantity > availableQuantity) {
        throw new BadRequestException(
          `Only ${availableQuantity} tickets available for ${tier.name}`,
        );
      }
      if (item.quantity > tier.maxPerOrder) {
        throw new BadRequestException(
          `Maximum ${tier.maxPerOrder} tickets allowed per order for ${tier.name}`,
        );
      }

      subtotal += tier.price * item.quantity;
      return { item, tier };
    });

    const serviceFeePercentage = this.configService.get<number>('STRIPE_SERVICE_FEE_PERCENTAGE') || 4;
    const serviceFee = Math.round(subtotal * (serviceFeePercentage / 100));
    const totalAmount = subtotal + serviceFee;
    const totalTickets = completeOrderDto.items.reduce((sum, i) => sum + i.quantity, 0);
    const serviceFeePerTicket = totalTickets > 0 ? Math.round(serviceFee / totalTickets) : 0;

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          paymentMethod: completeOrderDto.paymentMethod ?? 'manual',
          subtotal,
          serviceFee,
          totalAmount,
        },
      });

      const tickets = [];
      let ticketIndex = 1;

      for (const { item, tier } of itemsWithTier) {
        for (let i = 0; i < item.quantity; i++) {
          const ticketNumber = `${order.orderNumber}-T${ticketIndex}`;
          const qrToken = await this.generateQRToken(order.id, ticketNumber);
          ticketIndex += 1;

          const ticket = await tx.ticket.create({
            data: {
              orderId: order.id,
              eventId: order.eventId,
              tierId: tier.id,
              currentOwnerId: order.userId,
              originalOwnerId: order.userId,
              ticketNumber,
              qrCode: qrToken,
              faceValue: tier.price,
              pricePaid: tier.price + serviceFeePerTicket,
              status: 'VALID',
            },
          });

          tickets.push(ticket);
        }

        await tx.ticketTier.update({
          where: { id: tier.id },
          data: { quantitySold: { increment: item.quantity } },
        });
      }

      await tx.event.update({
        where: { id: order.eventId },
        data: {
          ticketsSold: { increment: totalTickets },
          totalRevenue: { increment: totalAmount },
          organizerRevenue: { increment: subtotal },
          platformRevenue: { increment: serviceFee },
        },
      });

      return { updatedOrder, tickets };
    });

    return result;
  }

  private async generateQRToken(orderId: string, ticketNumber: string): Promise<string> {
    const token = `${orderId}:${ticketNumber}:${uuidv4()}`;
    return token;
  }
}
