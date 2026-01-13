import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';

export enum GuestStatus {
  INVITED = 'INVITED',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  CHECKED_IN = 'CHECKED_IN',
}

export class UpdateGuestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(GuestStatus)
  @IsOptional()
  status?: GuestStatus;
}