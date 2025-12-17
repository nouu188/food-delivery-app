import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min, IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { DiscountType } from '../../enums';

export class CreateVoucherDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DiscountType)
  discount_type!: DiscountType;

  @IsNumber()
  @Min(0)
  discount_value!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  max_discount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  min_order_amount?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  usage_limit?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  per_user_limit?: number;

  @IsDate()
  @Type(() => Date)
  valid_from!: Date;

  @IsDate()
  @Type(() => Date)
  valid_until!: Date;

  @IsUUID()
  @IsOptional()
  restaurant_id?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateVoucherDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DiscountType)
  @IsOptional()
  discount_type?: DiscountType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount_value?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  max_discount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  min_order_amount?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  usage_limit?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  per_user_limit?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  valid_from?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  valid_until?: Date;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class ValidateVoucherDto {
  @IsString()
  code!: string;

  @IsUUID()
  restaurant_id!: string;

  @IsNumber()
  @Min(0)
  order_amount!: number;
}

export class VoucherResponseDto {
  id!: string;
  code!: string;
  name!: string;
  description!: string;
  discount_type!: DiscountType;
  discount_value!: number;
  max_discount!: number;
  min_order_amount!: number;
  usage_limit!: number;
  usage_count!: number;
  per_user_limit!: number;
  valid_from!: Date;
  valid_until!: Date;
  restaurant_id!: string;
  restaurant_name!: string;
  is_active!: boolean;
  created_at!: Date;
  updated_at!: Date;
}

export class VoucherValidationResponseDto {
  is_valid!: boolean;
  voucher?: VoucherResponseDto;
  discount_amount?: number;
  final_amount?: number;
  message?: string;
}
