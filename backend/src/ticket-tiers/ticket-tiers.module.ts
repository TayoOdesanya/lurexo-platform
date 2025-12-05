import { Module } from '@nestjs/common';
import { TicketTiersService } from './ticket-tiers.service';
import { TicketTiersController } from './ticket-tiers.controller';

@Module({
  controllers: [TicketTiersController],
  providers: [TicketTiersService],
  exports: [TicketTiersService],
})
export class TicketTiersModule {}
