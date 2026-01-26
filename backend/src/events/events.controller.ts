import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

import { UserRole, EventStatus } from '@prisma/client';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Post()
  @UseInterceptors(
    FileInterceptor('coverImage', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) => {
        // Accept common image types only
        const ok = /^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype);
        if (!ok) return cb(new BadRequestException('coverImage must be an image file'), false);
        cb(null, true);
      },
    }),
  )
  async create(
    @CurrentUser() user: any,
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() coverImageFile?: Express.Multer.File,
  ) {
    // ✅ Debug logging (keep it concise; avoid logging raw buffers)
    this.logger.debug(
      `POST /events by user=${user?.id} role=${user?.role ?? 'n/a'}`,
    );
    this.logger.debug(`DTO keys: ${Object.keys(createEventDto ?? {}).join(', ')}`);

    if (coverImageFile) {
      this.logger.debug(
        `File: fieldname=${coverImageFile.fieldname} originalname=${coverImageFile.originalname} mimetype=${coverImageFile.mimetype} size=${coverImageFile.size}`,
      );
    } else {
      this.logger.warn(
        `No coverImage file received (check multipart field name matches FileInterceptor('coverImage'))`,
      );
    }

    // If your UI always sends an image, enforce it:
    const REQUIRE_IMAGE = true;
    if (REQUIRE_IMAGE && (!coverImageFile || coverImageFile.size <= 0)) {
      throw new BadRequestException('coverImage file is required');
    }

    // Create event (service uploads cover image and stores provider-neutral key)
    const created = await this.eventsService.create(user.id, createEventDto, coverImageFile);

    this.logger.debug(`Event created: id=${created?.id ?? 'n/a'}`);
    return created;
  }

  @Public()
  @Get()
  findAll(
    @Query('status') status?: EventStatus,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('city') city?: string,
  ) {
    return this.eventsService.findAll({ status, category, search, city });
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Get('my-events')
  findMyEvents(@CurrentUser() user: any) {
    return this.eventsService.findByOrganizer(user.id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('coverImage', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) => {
        const ok = /^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype);
        if (!ok) return cb(new BadRequestException('coverImage must be an image file'), false);
        cb(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() coverImageFile?: Express.Multer.File,
  ) {
    return this.eventsService.update(id, user.id, updateEventDto, coverImageFile);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.cancel(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.remove(id, user.id);
  }
}
