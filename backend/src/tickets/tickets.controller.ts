import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TicketsService } from './tickets.service';
import { ScanTicketDto } from './dto/scan-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('scan')
  scanTicket(@CurrentUser() user: any, @Body() scanTicketDto: ScanTicketDto) {
    return this.ticketsService.scanTicket(user.id, scanTicketDto);
  }
}
