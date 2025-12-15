import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../enums';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  full_name!: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class RegisterResponseDto {
  id!: string;
  email!: string;
  full_name!: string;
  role!: UserRole;
  status!: string;
}
