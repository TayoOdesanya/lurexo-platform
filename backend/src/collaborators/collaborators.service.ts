import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { CollaboratorRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../email/email.service';

type PermissionFlags = {
  manageEvents: boolean;
  viewAnalytics: boolean;
  manageSales: boolean;
  accessDoor: boolean;
  sendMarketing: boolean;
  manageTeam: boolean;
};

const ROLE_PERMISSIONS: Record<CollaboratorRole, PermissionFlags> = {
  ADMIN: {
    manageEvents: true,
    viewAnalytics: true,
    manageSales: true,
    accessDoor: true,
    sendMarketing: true,
    manageTeam: true,
  },
  EVENT_MANAGER: {
    manageEvents: true,
    viewAnalytics: true,
    manageSales: false,
    accessDoor: true,
    sendMarketing: false,
    manageTeam: false,
  },
  MARKETING_LEAD: {
    manageEvents: false,
    viewAnalytics: true,
    manageSales: false,
    accessDoor: false,
    sendMarketing: true,
    manageTeam: false,
  },
  PROMOTER: {
    manageEvents: false,
    viewAnalytics: true,
    manageSales: false,
    accessDoor: false,
    sendMarketing: true,
    manageTeam: false,
  },
  SECURITY: {
    manageEvents: false,
    viewAnalytics: false,
    manageSales: false,
    accessDoor: true,
    sendMarketing: false,
    manageTeam: false,
  },
  STAFF: {
    manageEvents: false,
    viewAnalytics: false,
    manageSales: false,
    accessDoor: true,
    sendMarketing: false,
    manageTeam: false,
  },
};

function normalizeRole(input: string): CollaboratorRole {
  const normalized = (input || '')
    .trim()
    .toUpperCase()
    .replace(/-/g, '_');

  switch (normalized) {
    case 'ADMIN':
      return CollaboratorRole.ADMIN;
    case 'EVENT_MANAGER':
      return CollaboratorRole.EVENT_MANAGER;
    case 'MARKETING_LEAD':
      return CollaboratorRole.MARKETING_LEAD;
    case 'PROMOTER':
      return CollaboratorRole.PROMOTER;
    case 'SECURITY':
      return CollaboratorRole.SECURITY;
    case 'STAFF':
    default:
      return CollaboratorRole.STAFF;
  }
}

function parseOptionalDate(value?: string | null): Date | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

@Injectable()
export class CollaboratorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(organizerId: string) {
    const collaborators = await this.prisma.collaborator.findMany({
      where: { organizerId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            lastLoginAt: true,
          },
        },
        permissions: true,
        paymentSplits: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return collaborators.map((collab) => {
      const permissions = collab.permissions?.[0];
      const fullName = [collab.user?.firstName, collab.user?.lastName].filter(Boolean).join(' ');
      return {
        id: collab.id,
        name: fullName || collab.user?.email?.split('@')[0] || 'Collaborator',
        email: collab.user?.email,
        role: collab.role,
        status: collab.status,
        addedDate: collab.createdAt,
        lastActive: collab.user?.lastLoginAt,
        has2FA: collab.has2FA,
        assignedEvents: collab.assignedEvents ?? [],
        permissions: permissions
          ? {
              manageEvents: permissions.manageEvents,
              viewAnalytics: permissions.viewAnalytics,
              manageSales: permissions.manageSales,
              accessDoor: permissions.accessDoor,
              sendMarketing: permissions.sendMarketing,
              manageTeam: permissions.manageTeam,
            }
          : null,
        paymentSplit: (collab.paymentSplits || []).map((split) => ({
          enabled: split.enabled,
          percentage: split.percentage,
          eventId: split.eventId,
        })),
      };
    });
  }

  async create(organizerId: string, dto: CreateCollaboratorDto) {
    if (!dto?.email) {
      throw new BadRequestException('Email is required');
    }

    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, firstName: true, lastName: true, lastLoginAt: true },
    });
    let inviteToken: string | null = null;
    let inviteExpiresAt: Date | null = null;
    let createdUser = false;

    if (!user) {
      // Auto-invite: create a user with a reset token the invitee can use to set a password.
      inviteToken = uuidv4();
      inviteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const name = String(dto.name || '').trim();
      const [firstName, ...rest] = name.split(/\s+/).filter(Boolean);
      const lastName = rest.join(' ') || undefined;

      const tempPassword = uuidv4();
      const passwordHash = await bcrypt.hash(tempPassword, 12);

      const created = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: firstName || undefined,
          lastName,
          role: 'ORGANIZER',
          verificationToken: uuidv4(),
          resetToken: inviteToken,
          resetTokenExpiry: inviteExpiresAt,
        },
        select: { id: true, email: true, firstName: true, lastName: true, lastLoginAt: true },
      });

      user = created;
      createdUser = true;
    }

    if (user.id === organizerId) {
      throw new BadRequestException('You cannot invite yourself as a collaborator.');
    }

    const role = normalizeRole(dto.role);
    const permissions = ROLE_PERMISSIONS[role];

    const assignedEvents = Array.isArray(dto.assignedEvents) ? dto.assignedEvents : [];
    const tempAccessStart = dto.tempAccess ? parseOptionalDate(dto.accessStartDate) : null;
    const tempAccessEnd = dto.tempAccess ? parseOptionalDate(dto.accessEndDate) : null;

    if (dto.paymentSplitEnabled && dto.paymentSplitEvent) {
      const event = await this.prisma.event.findFirst({
        where: { id: dto.paymentSplitEvent, organizerId },
        select: { id: true },
      });
      if (!event) {
        throw new NotFoundException('Event not found for payment split.');
      }
    }

    try {
      const created = await this.prisma.collaborator.create({
        data: {
          userId: user.id,
          organizerId,
          role,
          status: 'PENDING',
          assignedEvents,
          tempAccessStart,
          tempAccessEnd,
          permissions: {
            create: permissions,
          },
          paymentSplits:
            dto.paymentSplitEnabled && dto.paymentSplitEvent && (dto.paymentSplitPercentage ?? 0) > 0
              ? {
                  create: {
                    eventId: dto.paymentSplitEvent,
                    percentage: Math.round(dto.paymentSplitPercentage ?? 0),
                    enabled: true,
                  },
                }
              : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              lastLoginAt: true,
            },
          },
          permissions: true,
          paymentSplits: true,
        },
      });

      const fullName = [created.user?.firstName, created.user?.lastName].filter(Boolean).join(' ');
      const permission = created.permissions?.[0];

      const organizer = await this.prisma.user.findUnique({
        where: { id: organizerId },
        select: { firstName: true, lastName: true, organizerName: true, email: true },
      });

      const organizerName =
        organizer?.organizerName ||
        [organizer?.firstName, organizer?.lastName].filter(Boolean).join(' ') ||
        organizer?.email ||
        'Organizer';

      await this.emailService.sendCollaboratorInvite({
        to: created.user?.email || dto.email,
        organizerName,
        role: created.role,
        inviteToken,
        inviteExpiresAt,
      });

      return {
        id: created.id,
        name: fullName || created.user?.email?.split('@')[0] || 'Collaborator',
        email: created.user?.email,
        role: created.role,
        status: created.status,
        addedDate: created.createdAt,
        lastActive: created.user?.lastLoginAt,
        has2FA: created.has2FA,
        assignedEvents: created.assignedEvents ?? [],
        permissions: permission
          ? {
              manageEvents: permission.manageEvents,
              viewAnalytics: permission.viewAnalytics,
              manageSales: permission.manageSales,
              accessDoor: permission.accessDoor,
              sendMarketing: permission.sendMarketing,
              manageTeam: permission.manageTeam,
            }
          : null,
        paymentSplit: (created.paymentSplits || []).map((split) => ({
          enabled: split.enabled,
          percentage: split.percentage,
          eventId: split.eventId,
        })),
        inviteToken,
        inviteExpiresAt,
        createdUser,
      };
    } catch (error: any) {
      const msg = String(error?.message || '');
      if (msg.includes('collaborators_userId_organizerId_key')) {
        throw new ConflictException('Collaborator already exists for this organizer.');
      }
      throw error;
    }
  }
}
