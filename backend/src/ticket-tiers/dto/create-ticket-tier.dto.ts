import { IsString, IsInt, Min, IsOptional, IsDateString, MinLength } from 'class-validator';

export class CreateTicketTierDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  price: number; // Price in pence

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxPerOrder?: number = 10;

  @IsDateString()
  @IsOptional()
  saleStartDate?: string;

  @IsDateString()
  @IsOptional()
  saleEndDate?: string;

  @IsInt()
  @IsOptional()
  displayOrder?: number = 0;
}
