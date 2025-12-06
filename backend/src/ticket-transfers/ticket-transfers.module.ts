import { Module } from '@nestjs/common';
import { TicketTransfersService } from './ticket-transfers.service';
import { TicketTransfersController } from './ticket-transfers.controller';

@Module({
  controllers: [TicketTransfersController],
  providers: [TicketTransfersService],
  exports: [TicketTransfersService],
})
export class TicketTransfersModule {}
