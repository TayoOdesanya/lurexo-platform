import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  organizerBio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  organizerCompanyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  organizerWebsite?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  organizerAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  organizerVatNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  organizerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  organizerUsername?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  organizerAvatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  profilePicture?: string;
}
