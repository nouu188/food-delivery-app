// Backend order status enum (11 values)
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  PICKED_UP = 'PICKED_UP',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentMethod {
  COD = 'COD',
  WALLET = 'WALLET',
  CARD = 'CARD',
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
}

export enum CancelledBy {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT = 'RESTAURANT',
  SYSTEM = 'SYSTEM',
}

export interface CartItem {
  id: string;
  cart_id: string;
  menu_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_options: Array<{
    option_group: string;
    name: string;
    price_modifier: number;
  }>;
  special_instructions: string | null;
  // Populated menu item details
  menu_item?: {
    id: string;
    name: string;
    image_url: string | null;
    price: number;
  };
}

export interface Cart {
  id: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name?: string;
  subtotal: number;
  delivery_fee: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  items: CartItem[];
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface AddToCartRequest {
  menu_item_id: string;
  quantity: number;
  selected_options?: Array<{
    option_group: string;
    name: string;
    price_modifier: number;
  }>;
  special_instructions?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CreateOrderRequest {
  delivery_address_id: string;
  payment_method: PaymentMethod;
  voucher_code?: string;
  special_instructions?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name?: string;
  delivery_address_id: string;
  delivery_address?: any;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  voucher_id: string | null;
  voucher_code?: string | null;
  payment_method: PaymentMethod;
  special_instructions: string | null;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  cancelled_by: CancelledBy | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_options: any; // JSONB
  special_instructions: string | null;
  // Populated menu item details
  menu_item?: {
    id: string;
    name: string;
    image_url: string | null;
    price: number;
  };
}

export interface CancelOrderRequest {
  cancellation_reason: string;
  cancelled_by: CancelledBy;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  note?: string;
}

export interface GetOrdersRequest {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export interface GetOrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
