import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Get('dashboard')
  getOrganizerDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getOrganizerDashboard(user.id);
  }

  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Get('events/:eventId')
  getEventAnalytics(
    @Param('eventId') eventId: string,
    @CurrentUser() user: any,
  ) {
    return this.analyticsService.getEventAnalytics(eventId, user.id);
  }

  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Get('events/:eventId/attendees')
  getAttendeeList(
    @Param('eventId') eventId: string,
    @CurrentUser() user: any,
  ) {
    return this.analyticsService.getAttendeeList(eventId, user.id);
  }
}
