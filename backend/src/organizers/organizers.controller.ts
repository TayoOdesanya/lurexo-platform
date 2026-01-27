import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { OrganizersService } from './organizers.service';

@Controller('organizers')
export class OrganizersController {
  constructor(private readonly organizersService: OrganizersService) {}

  @Public()
  @Get(':id')
  findProfile(@Param('id') id: string) {
    return this.organizersService.findProfile(id);
  }
}
