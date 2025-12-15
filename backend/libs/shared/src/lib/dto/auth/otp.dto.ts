import { IsString, IsEnum } from 'class-validator';
import { OtpType } from '../../enums';

export class SendOtpDto {
  @IsString()
  identifier!: string;

  @IsEnum(OtpType)
  type!: OtpType;
}

export class VerifyOtpDto {
  @IsString()
  identifier!: string;

  @IsString()
  otp!: string;

  @IsEnum(OtpType)
  type!: OtpType;
}

export class ResetPasswordDto {
  @IsString()
  identifier!: string;

  @IsString()
  otp!: string;

  @IsString()
  new_password!: string;
}
