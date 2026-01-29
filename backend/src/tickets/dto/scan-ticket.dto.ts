import { IsOptional, IsString } from 'class-validator';

export class ScanTicketDto {
  @IsString()
  qrCode: string;

  @IsOptional()
  @IsString()
  scannerId?: string;

  @IsOptional()
  @IsString()
  eventId?: string;
}
