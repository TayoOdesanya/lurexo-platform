import { IsString, IsEnum, IsDateString, IsInt, Min, IsOptional, IsArray, MinLength, IsNumber } from 'class-validator';
import { EventCategory } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsEnum(EventCategory)
  category: EventCategory;

  @IsString()
  heroImage: string;

  @IsArray()
  @IsOptional()
  galleryImages?: string[];

  @IsString()
  venue: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  country?: string = 'United Kingdom';

  @IsString()
  postalCode: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsDateString()
  eventDate: string;

  @IsDateString()
  @IsOptional()
  doorsOpen?: string;

  @IsDateString()
  @IsOptional()
  eventEnd?: string;

  @IsString()
  @IsOptional()
  timezone?: string = 'Europe/London';

  @IsDateString()
  saleStartDate: string;

  @IsDateString()
  saleEndDate: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxTicketsPerOrder?: number = 10;

  @IsInt()
  @Min(1)
  totalCapacity: number;
}
