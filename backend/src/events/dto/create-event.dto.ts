import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
  IsOptional,
  IsArray,
  MinLength,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { EventCategory, EventStatus } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsEnum(EventCategory)
  category: EventCategory;

  /**
   * ✅ IMPORTANT:
   * When using multipart upload, you send the image file separately (e.g. FileInterceptor('heroImage')).
   * The controller/service uploads to Blob and then sets dto.heroImage = uploadedUrl.
   * So heroImage must be optional here.
   */
  @IsOptional()
  @IsString()
  // Optional: if you always store a URL here, keep this to validate it when present
  @IsUrl({ require_tld: false }, { message: 'heroImage must be a valid URL' })
  heroImage?: string;

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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsDateString()
  eventDate: string;

  @IsOptional()
  @IsDateString()
  doorsOpen?: string;

  @IsOptional()
  @IsDateString()
  eventEnd?: string;

  @IsString()
  @IsOptional()
  timezone?: string = 'Europe/London';

  @IsDateString()
  saleStartDate: string;

  @IsDateString()
  saleEndDate: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxTicketsPerOrder?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalCapacity: number;

  /**
   * ✅ Optional: support draft/publish from UI
   * Prisma has default(DRAFT) anyway, but allowing it avoids "property status should not exist"
   */
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
