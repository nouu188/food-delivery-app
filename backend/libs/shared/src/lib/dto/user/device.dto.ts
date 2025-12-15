import { IsString, IsEnum } from 'class-validator';
import { Platform } from '../../enums';

export class RegisterDeviceDto {
  @IsString()
  device_token!: string;

  @IsEnum(Platform)
  platform!: Platform;
}
