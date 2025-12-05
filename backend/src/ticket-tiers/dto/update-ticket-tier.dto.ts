import { IsString, IsInt, Min, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { TierStatus } from '@prisma/client';

export class UpdateTicketTierDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsEnum(TierStatus)
  @IsOptional()
  status?: TierStatus;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxPerOrder?: number;

  @IsDateString()
  @IsOptional()
  saleStartDate?: string;

  @IsDateString()
  @IsOptional()
  saleEndDate?: string;

  @IsInt()
  @IsOptional()
  displayOrder?: number;
}
