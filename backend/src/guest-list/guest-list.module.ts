import { Module } from '@nestjs/common';
import { GuestListController } from './guest-list.controller';
import { GuestListService } from './guest-list.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GuestListController],
  providers: [GuestListService],
  exports: [GuestListService],
})
export class GuestListModule {}
