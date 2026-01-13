import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GuestListService } from './guest-list.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Controller('events/:eventId/guests')
export class GuestListController {
  constructor(private readonly guestListService: GuestListService) {}

  /**
   * GET /events/:eventId/guests
   * Get all guests for an event
   */
  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.guestListService.findAllByEvent(eventId);
  }

  /**
   * POST /events/:eventId/guests
   * Add a new guest
   */
  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() createGuestDto: CreateGuestDto,
  ) {
    return this.guestListService.create(eventId, createGuestDto);
  }

  /**
   * GET /events/:eventId/guests/:guestId
   * Get a single guest
   */
  @Get(':guestId')
  findOne(
    @Param('eventId') eventId: string,
    @Param('guestId') guestId: string,
  ) {
    return this.guestListService.findOne(eventId, guestId);
  }

  /**
   * PATCH /events/:eventId/guests/:guestId
   * Update a guest
   */
  @Patch(':guestId')
  update(
    @Param('eventId') eventId: string,
    @Param('guestId') guestId: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    return this.guestListService.update(eventId, guestId, updateGuestDto);
  }

  /**
   * DELETE /events/:eventId/guests/:guestId
   * Remove a guest
   */
  @Delete(':guestId')
  remove(
    @Param('eventId') eventId: string,
    @Param('guestId') guestId: string,
  ) {
    return this.guestListService.remove(eventId, guestId);
  }

  /**
   * POST /events/:eventId/guests/:guestId/send-invitation
   * Send invitation email
   */
  @Post(':guestId/send-invitation')
  sendInvitation(
    @Param('eventId') eventId: string,
    @Param('guestId') guestId: string,
  ) {
    return this.guestListService.sendInvitation(eventId, guestId);
  }
}