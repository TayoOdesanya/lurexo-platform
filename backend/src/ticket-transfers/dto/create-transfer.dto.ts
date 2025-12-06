import { IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  ticketId: string;

  @IsEmail()
  recipientEmail: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  message?: string;
}
