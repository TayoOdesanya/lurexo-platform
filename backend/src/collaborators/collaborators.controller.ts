import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';

@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Get()
  findAll(@CurrentUser() user: any) {
    return this.collaboratorsService.findAll(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateCollaboratorDto) {
    return this.collaboratorsService.create(user.id, dto);
  }
}
