import { IsString, IsArray, ArrayMinSize, ValidateNested, IsEmail, MinLength, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  tierId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  eventId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsEmail()
  buyerEmail: string;

  @IsString()
  @MinLength(2)
  buyerFirstName: string;

  @IsString()
  @MinLength(2)
  buyerLastName: string;
}
