import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { GuestListStatus } from '@prisma/client';

export class UpdateGuestListEntryDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(GuestListStatus)
  @IsOptional()
  status?: GuestListStatus;
}
