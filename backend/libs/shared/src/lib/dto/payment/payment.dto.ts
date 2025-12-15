import { IsString, IsNumber, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../../enums';

export class ProcessPaymentDto {
  @IsUUID()
  order_id!: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsNumber()
  amount!: number;
}

export class RefundPaymentDto {
  @IsNumber()
  refund_amount!: number;

  @IsString()
  refund_reason!: string;
}

export class PaymentResponseDto {
  id!: string;
  order_id!: string;
  user_id!: string;
  amount!: number;
  method!: PaymentMethod;
  status!: PaymentStatus;
  transaction_id!: string;
  gateway_response: any;
  paid_at!: Date;
  refund_amount!: number;
  refunded_at!: Date;
  refund_reason!: string;
  created_at!: Date;
  updated_at!: Date;
}
