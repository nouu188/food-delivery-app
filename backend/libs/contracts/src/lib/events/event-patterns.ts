export const ORDER_EVENTS = {
  CREATED: 'order.created',
  CANCELLED: 'order.cancelled',
  DELIVERED: 'order.delivered',
  STATUS_CHANGED: 'order.status.changed',
} as const;

export const PAYMENT_EVENTS = {
  COMPLETED: 'payment.completed',
  FAILED: 'payment.failed',
  REFUNDED: 'payment.refunded',
} as const;

export const DELIVERY_EVENTS = {
  DRIVER_ASSIGNED: 'delivery.driver.assigned',
  STATUS_CHANGED: 'delivery.status.changed',
  DRIVER_LOCATION_UPDATED: 'delivery.driver.location.updated',
} as const;

export const REVIEW_EVENTS = {
  CREATED: 'review.created',
} as const;

export const NOTIFICATION_EVENTS = {
  SENT: 'notification.sent',
} as const;

export const VOUCHER_EVENTS = {
  USED: 'voucher.used',
  EXPIRED: 'voucher.expired',
} as const;
