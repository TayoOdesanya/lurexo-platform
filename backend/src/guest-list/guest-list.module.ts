import { Module } from '@nestjs/common';
import { GuestListService } from './guest-list.service';
import { GuestListController } from './guest-list.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GuestListController],
  providers: [GuestListService],
  exports: [GuestListService],
})
export class GuestListModule {}