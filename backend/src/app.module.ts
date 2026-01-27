import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { TicketTiersModule } from './ticket-tiers/ticket-tiers.module';
import { OrdersModule } from './orders/orders.module';
import { TicketTransfersModule } from './ticket-transfers/ticket-transfers.module';
import { ResaleMarketplaceModule } from './resale-marketplace/resale-marketplace.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { HealthModule } from './health/health.module';
import { appSettingsConfig } from './config/appsettings';
import { GuestListModule } from './guest-list/guest-list.module';
import { OrganizersModule } from './organizers/organizers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appSettingsConfig] }),
    PrismaModule,
    AuthModule,
    EventsModule,
    TicketTiersModule,
    OrdersModule,
    TicketTransfersModule,
    ResaleMarketplaceModule,
    AnalyticsModule,
    HealthModule,
    GuestListModule,
    OrganizersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
