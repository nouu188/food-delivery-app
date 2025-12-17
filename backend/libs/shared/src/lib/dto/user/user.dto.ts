import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsUrl()
  @IsOptional()
  avatar_url?: string;
}

export class UserProfileDto {
  id!: string;
  email!: string;
  phone!: string;
  full_name!: string;
  avatar_url!: string;
  role!: string;
  status!: string;
  email_verified_at!: Date;
  phone_verified_at!: Date;
  created_at!: Date;
}
