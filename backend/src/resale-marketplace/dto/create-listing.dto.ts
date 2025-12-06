import { IsString, IsInt, Min } from 'class-validator';

export class CreateListingDto {
  @IsString()
  ticketId: string;

  @IsInt()
  @Min(1)
  price: number; // Price in pence
}
