import { PaymentMethod } from "@backend/shared";

export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  restaurantId: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  dropoffLatitude?: number;
  dropoffLongitude?: number;
  voucherId?: string;
  discountAmount?: number;
}

export interface OrderCancelledPayload {
  orderId: string;
  userId: string;
  cancelledBy: string;
  reason: string;
}

export interface OrderDeliveredPayload {
  orderId: string;
  userId: string;
  deliveredAt: Date;
}

export interface OrderStatusChangedPayload {
  orderId: string;
  userId: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
}

export interface PaymentCompletedPayload {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  method: string;
}

export interface ReviewCreatedPayload {
  reviewId: string;
  restaurantId: string;
  restaurantOwnerId: string;
  userId: string;
  foodRating: number;
  deliveryRating: number;
  driverId?: string;
}
