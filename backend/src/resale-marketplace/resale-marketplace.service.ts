import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PurchaseListingDto } from './dto/purchase-listing.dto';
import Stripe from 'stripe';

@Injectable()
export class ResaleMarketplaceService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createListing(userId: string, createListingDto: CreateListingDto) {
    const { ticketId, price } = createListingDto;

    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: true,
        tier: true,
        listings: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.currentOwnerId !== userId) {
      throw new ForbiddenException('You can only list tickets you own');
    }

    if (ticket.status !== 'VALID') {
      throw new BadRequestException(`Ticket status is ${ticket.status} and cannot be listed`);
    }

    if (ticket.event.status === 'CANCELLED') {
      throw new BadRequestException('Cannot list tickets for cancelled events');
    }

    if (!ticket.event.allowResale) {
      throw new BadRequestException('Resale is not allowed for this event');
    }

    if (new Date() > ticket.event.eventDate) {
      throw new BadRequestException('Cannot list tickets for past events');
    }

    if (ticket.listings.length > 0) {
      throw new BadRequestException('This ticket is already listed for sale');
    }

    const maxPrice = this.calculateMaxResalePrice(ticket);

    if (price > maxPrice) {
      const capType = ticket.event.resaleCapType;
      let message = '';

      switch (capType) {
        case 'FACE_VALUE_ONLY':
          message = `UK law prohibits selling tickets above face value. Maximum price: £${(maxPrice / 100).toFixed(2)}`;
          break;
        case 'FACE_VALUE_PLUS_FEES':
          message = `Maximum resale price (including original fees): £${(maxPrice / 100).toFixed(2)}`;
          break;
        case 'PERCENTAGE_CAP':
          message = `Maximum resale price (${ticket.event.resaleCapValue}% of face value): £${(maxPrice / 100).toFixed(2)}`;
          break;
        default:
          message = `Maximum resale price: £${(maxPrice / 100).toFixed(2)}`;
      }

      throw new BadRequestException(message);
    }

    const expiresAt = new Date(ticket.event.eventDate);
    expiresAt.setHours(expiresAt.getHours() - 2);

    const listing = await this.prisma.$transaction(async (tx) => {
      const newListing = await tx.ticketListing.create({
        data: {
          ticketId,
          eventId: ticket.eventId,
          sellerId: userId,
          price,
          status: 'ACTIVE',
          expiresAt,
        },
        include: {
          ticket: {
            include: {
              event: true,
              tier: true,
            },
          },
          seller: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      await tx.ticket.update({
        where: { id: ticketId },
        data: { status: 'LISTED_FOR_SALE' },
      });

      return newListing;
    });

    return {
      listing,
      maxAllowedPrice: maxPrice,
      capType: ticket.event.resaleCapType,
      message: 'Listing created successfully',
    };
  }

  async findAllListings(filters?: {
    eventId?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }) {
    const where: any = {
      status: filters?.status || 'ACTIVE',
    };

    if (filters?.eventId) {
      where.eventId = filters.eventId;
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    const listings = await this.prisma.ticketListing.findMany({
      where,
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
        seller: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return listings;
  }

  async findOne(listingId: string) {
    const listing = await this.prisma.ticketListing.findUnique({
      where: { id: listingId },
      include: {
        ticket: {
          include: {
            event: true,
            tier: true,
          },
        },
        seller: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async getUserListings(userId: string) {
    const listings = await this.prisma.ticketListing.findMany({
      where: { sellerId: userId },
      include: {
        ticket: {
          include: {
            event: {
              select: {
                title: true,
                eventDate: true,
              },
            },
            tier: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return listings;
  }

  async updateListing(listingId: string, userId: string, updateListingDto: UpdateListingDto) {
    const listing = await this.prisma.ticketListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    if (listing.status !== 'ACTIVE') {
      throw new BadRequestException('Only active listings can be updated');
    }

    const updatedListing = await this.prisma.ticketListing.update({
      where: { id: listingId },
      data: updateListingDto,
    });

    return updatedListing;
  }

  async cancelListing(listingId: string, userId: string) {
    const listing = await this.prisma.ticketListing.findUnique({
      where: { id: listingId },
      include: { ticket: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only cancel your own listings');
    }

    if (listing.status !== 'ACTIVE') {
      throw new BadRequestException('Only active listings can be cancelled');
    }

    const result = await this.prisma.$transaction([
      this.prisma.ticketListing.update({
        where: { id: listingId },
        data: { status: 'CANCELLED' },
      }),

      this.prisma.ticket.update({
        where: { id: listing.ticketId },
        data: { status: 'VALID' },
      }),
    ]);

    return {
      message: 'Listing cancelled successfully',
      listing: result[0],
    };
  }

  async purchaseListing(listingId: string, userId: string, purchaseListingDto: PurchaseListingDto) {
    const listing = await this.prisma.ticketListing.findUnique({
      where: { id: listingId },
      include: {
        ticket: {
          include: {
            event: true,
            tier: true,
          },
        },
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== 'ACTIVE') {
      throw new BadRequestException('This listing is no longer available');
    }

    if (listing.sellerId === userId) {
      throw new BadRequestException('You cannot purchase your own listing');
    }

    if (new Date() > listing.expiresAt) {
      await this.prisma.ticketListing.update({
        where: { id: listingId },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('This listing has expired');
    }

    const platformFeePercentage = this.configService.get<number>('RESALE_PLATFORM_FEE_PERCENTAGE') || 8;
    const platformFee = Math.round(listing.price * (platformFeePercentage / 100));
    const totalAmount = listing.price + platformFee;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'gbp',
      metadata: {
        listingId: listing.id,
        ticketId: listing.ticketId,
        eventId: listing.ticket.eventId,
        buyerId: userId,
        sellerId: listing.sellerId,
        type: 'resale',
      },
      description: `Resale: ${listing.ticket.event.title} - ${listing.ticket.tier.name}`,
    });

    return {
      listing,
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      },
      pricing: {
        ticketPrice: listing.price,
        platformFee,
        totalAmount,
      },
      publishableKey: this.configService.get('STRIPE_PUBLISHABLE_KEY'),
    };
  }

  async handleResalePurchaseSuccess(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment has not succeeded');
    }

    const { listingId, ticketId, buyerId, sellerId } = paymentIntent.metadata;

    const listing = await this.prisma.ticketListing.findUnique({
      where: { id: listingId },
      include: { ticket: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== 'ACTIVE') {
      throw new BadRequestException('Listing is no longer active');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.ticketListing.update({
        where: { id: listingId },
        data: {
          status: 'SOLD',
          buyerId,
          soldAt: new Date(),
        },
      });

      await tx.ticket.update({
        where: { id: ticketId },
        data: {
          currentOwnerId: buyerId,
          status: 'VALID',
        },
      });

      const sellerPayout = listing.price;

      return { listing, sellerPayout };
    });

    return result;
  }

  private calculateMaxResalePrice(ticket: any): number {
    const event = ticket.event;

    switch (event.resaleCapType) {
      case 'FACE_VALUE_ONLY':
        return ticket.faceValue;

      case 'FACE_VALUE_PLUS_FEES':
        return ticket.pricePaid;

      case 'PERCENTAGE_CAP':
        const percentage = event.resaleCapValue || 110;
        return Math.floor(ticket.faceValue * (percentage / 100));

      case 'NO_CAP':
        return Infinity;

      case 'CUSTOM':
        return event.customResaleCap || ticket.faceValue;

      default:
        return Math.floor(ticket.faceValue * 1.1);
    }
  }
}
