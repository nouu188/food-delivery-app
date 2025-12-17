import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { DeliveryStatus } from '../../enums';

export class AcceptDeliveryDto {
  @IsUUID()
  delivery_id!: string;
}

export class UpdateDeliveryStatusDto {
  @IsEnum(DeliveryStatus)
  status!: DeliveryStatus;

  @IsString()
  @IsOptional()
  delivery_proof_url?: string;

  @IsString()
  @IsOptional()
  failure_reason?: string;
}

export class DeliveryResponseDto {
  id!: string;
  order_id!: string;
  driver_id!: string;
  driver_name!: string;
  driver_phone!: string;
  driver_vehicle!: string;
  status!: DeliveryStatus;
  pickup_latitude!: number;
  pickup_longitude!: number;
  dropoff_latitude!: number;
  dropoff_longitude!: number;
  distance_km!: number;
  estimated_duration!: number;
  assigned_at!: Date;
  picked_up_at!: Date;
  delivered_at!: Date;
  delivery_proof_url!: string;
  failure_reason!: string;
  current_location!: {
    latitude: number;
    longitude: number;
    heading: number;
    speed: number;
    updated_at: Date;
  };
  created_at!: Date;
  updated_at!: Date;
}
