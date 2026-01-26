import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GuestListService } from './guest-list.service';
import { CreateGuestListEntryDto } from './dto/create-guest-list-entry.dto';
import { UpdateGuestListEntryDto } from './dto/update-guest-list-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('events/:eventId/guest-list')
export class GuestListController {
  constructor(private readonly guestListService: GuestListService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Post()
  create(
    @Param('eventId') eventId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateGuestListEntryDto,
  ) {
    return this.guestListService.create(eventId, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Get()
  findAll(@Param('eventId') eventId: string, @CurrentUser() user: any) {
    return this.guestListService.findAll(eventId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Get(':id')
  findOne(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.guestListService.findOne(eventId, id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateGuestListEntryDto,
  ) {
    return this.guestListService.update(eventId, id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Delete(':id')
  remove(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.guestListService.remove(eventId, id, user.id);
  }
}
