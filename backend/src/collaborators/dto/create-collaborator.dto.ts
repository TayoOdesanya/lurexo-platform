import { IsArray, IsBoolean, IsEmail, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCollaboratorDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  role: string;

  @IsArray()
  @IsOptional()
  assignedEvents?: string[];

  @IsBoolean()
  @IsOptional()
  tempAccess?: boolean;

  @IsString()
  @IsOptional()
  accessStartDate?: string;

  @IsString()
  @IsOptional()
  accessEndDate?: string;

  @IsBoolean()
  @IsOptional()
  paymentSplitEnabled?: boolean;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  paymentSplitPercentage?: number;

  @IsString()
  @IsOptional()
  paymentSplitEvent?: string;
}
