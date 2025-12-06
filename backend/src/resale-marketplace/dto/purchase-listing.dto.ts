import { IsEmail, IsString, MinLength } from 'class-validator';

export class PurchaseListingDto {
  @IsEmail()
  buyerEmail: string;

  @IsString()
  @MinLength(2)
  buyerFirstName: string;

  @IsString()
  @MinLength(2)
  buyerLastName: string;
}
