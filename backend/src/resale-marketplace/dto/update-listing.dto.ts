import { IsEnum, IsOptional } from 'class-validator';
import { ListingStatus } from '@prisma/client';

export class UpdateListingDto {
  @IsEnum(ListingStatus)
  @IsOptional()
  status?: ListingStatus;
}
