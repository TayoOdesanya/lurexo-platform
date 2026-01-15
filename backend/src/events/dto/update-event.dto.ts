import { IsString, IsEnum, IsDateString, IsInt, Min, IsOptional, IsArray, MinLength, IsNumber } from 'class-validator';
import { EventCategory, EventStatus } from '@prisma/client';

export class UpdateEventDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(10)
  @IsOptional()
  description?: string;

  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsString()
  @IsOptional()
  heroImage?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  galleryImages?: string[];

  @IsString()
  @IsOptional()
  venue?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsDateString()
  @IsOptional()
  eventDate?: string;

  @IsDateString()
  @IsOptional()
  doorsOpen?: string;

  @IsDateString()
  @IsOptional()
  eventEnd?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsDateString()
  @IsOptional()
  saleStartDate?: string;

  @IsDateString()
  @IsOptional()
  saleEndDate?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxTicketsPerOrder?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  totalCapacity?: number;
}
