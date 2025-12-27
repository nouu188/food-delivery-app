export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_DELIVERY = 'FREE_DELIVERY',
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  max_discount: number | null;
  min_order_amount: number;
  usage_limit: number | null;
  usage_count: number;
  per_user_limit: number;
  valid_from: string;
  valid_until: string;
  restaurant_id: string | null;
  restaurant_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VoucherValidationRequest {
  code: string;
  restaurant_id: string;
  order_amount: number;
}

export interface VoucherValidationResponse {
  is_valid: boolean;
  voucher?: Voucher;
  discount_amount?: number;
  final_amount?: number;
  message?: string;
}

export interface GetAvailableVouchersParams {
  restaurant_id?: string;
}

export interface AppliedVoucher {
  voucher: Voucher;
  discount_amount: number;
  final_amount: number;
}
