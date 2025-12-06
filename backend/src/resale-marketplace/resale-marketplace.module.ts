import { Module } from '@nestjs/common';
import { ResaleMarketplaceService } from './resale-marketplace.service';
import { ResaleMarketplaceController } from './resale-marketplace.controller';

@Module({
  controllers: [ResaleMarketplaceController],
  providers: [ResaleMarketplaceService],
  exports: [ResaleMarketplaceService],
})
export class ResaleMarketplaceModule {}
