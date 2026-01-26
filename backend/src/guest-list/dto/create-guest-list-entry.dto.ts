import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { GuestListStatus } from '@prisma/client';

export class CreateGuestListEntryDto {
  @IsString()
  @MinLength(2)
  name: string;

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
