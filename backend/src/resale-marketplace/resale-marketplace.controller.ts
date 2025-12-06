import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { ResaleMarketplaceService } from './resale-marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PurchaseListingDto } from './dto/purchase-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('resale-marketplace')
export class ResaleMarketplaceController {
  constructor(private readonly resaleMarketplaceService: ResaleMarketplaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('listings')
  createListing(
    @CurrentUser() user: any,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.resaleMarketplaceService.createListing(user.id, createListingDto);
  }

  @Public()
  @Get('listings')
  findAllListings(
    @Query('eventId') eventId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('status') status?: string,
  ) {
    return this.resaleMarketplaceService.findAllListings({
      eventId,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      status,
    });
  }

  @Public()
  @Get('listings/:id')
  findOne(@Param('id') id: string) {
    return this.resaleMarketplaceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-listings')
  getUserListings(@CurrentUser() user: any) {
    return this.resaleMarketplaceService.getUserListings(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('listings/:id')
  updateListing(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.resaleMarketplaceService.updateListing(id, user.id, updateListingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('listings/:id')
  cancelListing(@Param('id') id: string, @CurrentUser() user: any) {
    return this.resaleMarketplaceService.cancelListing(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('listings/:id/purchase')
  purchaseListing(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() purchaseListingDto: PurchaseListingDto,
  ) {
    return this.resaleMarketplaceService.purchaseListing(id, user.id, purchaseListingDto);
  }
}
