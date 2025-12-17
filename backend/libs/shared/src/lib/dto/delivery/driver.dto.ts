import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { VehicleType, DriverStatus } from '../../enums';

export class RegisterDriverDto {
  @IsEnum(VehicleType)
  vehicle_type: VehicleType;

  @IsString()
  vehicle_plate: string;

  @IsString()
  license_number: string;

  @IsString()
  license_image_url: string;
}

export class UpdateDriverDto {
  @IsEnum(VehicleType)
  @IsOptional()
  vehicle_type?: VehicleType;

  @IsString()
  @IsOptional()
  vehicle_plate?: string;

  @IsString()
  @IsOptional()
  license_number?: string;

  @IsString()
  @IsOptional()
  license_image_url?: string;
}

export class UpdateDriverStatusDto {
  @IsBoolean()
  is_online: boolean;
}

export class UpdateDriverLocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  @IsOptional()
  heading?: number;

  @IsNumber()
  @IsOptional()
  speed?: number;
}

export class DriverResponseDto {
  id: string;
  user_id: string;
  vehicle_type: VehicleType;
  vehicle_plate: string;
  license_number: string;
  license_image_url: string;
  average_rating: number;
  total_deliveries: number;
  is_online: boolean;
  is_verified: boolean;
  status: DriverStatus;
  current_location: {
    latitude: number;
    longitude: number;
  };
  created_at: Date;
  updated_at: Date;
}
