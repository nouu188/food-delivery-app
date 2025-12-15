import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, OrderStatus, CancelledBy } from '../../enums';

export class CreateOrderDto {
  @IsUUID()
  delivery_address_id!: string;

  @IsEnum(PaymentMethod)
  payment_method!: PaymentMethod;

  @IsString()
  @IsOptional()
  voucher_code?: string;

  @IsString()
  @IsOptional()
  special_instructions?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CancelOrderDto {
  @IsString()
  cancellation_reason!: string;

  @IsEnum(CancelledBy)
  cancelled_by!: CancelledBy;
}

export class OrderQueryDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsUUID()
  restaurant_id?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class OrderItemDto {
  id!: string;
  menu_item_id!: string;
  item_name!: string;
  quantity!: number;
  unit_price!: number;
  total_price!: number;
  selected_options: any;
  special_instructions!: string;
}

export class OrderResponseDto {
  id!: string;
  order_number!: string;
  user_id!: string;
  restaurant_id!: string;
  restaurant_name!: string;
  delivery_address!: string;
  status!: OrderStatus;
  items!: OrderItemDto[];
  subtotal!: number;
  delivery_fee!: number;
  discount_amount!: number;
  total_amount!: number;
  payment_method!: PaymentMethod;
  voucher_code!: string;
  special_instructions!: string;
  estimated_delivery!: Date;
  actual_delivery!: Date;
  cancelled_at!: Date;
  cancellation_reason!: string;
  cancelled_by!: CancelledBy;
  created_at!: Date;
  updated_at!: Date;
}

export class OrderListResponseDto {
  data!: OrderResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
  total_pages!: number;
}
