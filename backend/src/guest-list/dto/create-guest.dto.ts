import { IsString, IsEmail, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export enum GuestCategory {
  VIP = 'VIP',
  INDUSTRY = 'INDUSTRY',
  COMP = 'COMP',
  STAFF = 'STAFF',
  PRESS = 'PRESS',
  SPONSOR = 'SPONSOR',
}

export class CreateGuestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsEnum(GuestCategory)
  @IsNotEmpty()
  category: GuestCategory;

  @IsString()
  @IsOptional()
  notes?: string;
}