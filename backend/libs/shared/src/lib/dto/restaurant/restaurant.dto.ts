import { IsString, IsNumber, IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  phone!: string;

  @IsString()
  address!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsUrl()
  @IsOptional()
  logo_url?: string;

  @IsUrl()
  @IsOptional()
  cover_image_url?: string;

  @IsNumber()
  @IsOptional()
  min_order_amount?: number;

  @IsNumber()
  @IsOptional()
  delivery_fee?: number;

  @IsNumber()
  @IsOptional()
  estimated_prep_time?: number;
}

export class UpdateRestaurantDto extends CreateRestaurantDto {}

export class RestaurantDto {
  id!: string;
  name!: string;
  description!: string;
  phone!: string;
  address!: string;
  latitude!: number;
  longitude!: number;
  logo_url!: string;
  cover_image_url!: string;
  average_rating!: number;
  total_reviews!: number;
  min_order_amount!: number;
  delivery_fee!: number;
  estimated_prep_time!: number;
  is_open!: boolean;
  is_featured!: boolean;
  status!: string;
}
