export enum NotificationType {
  ORDER_UPDATE = 'ORDER_UPDATE',
  PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION',
  DELIVERY_STATUS = 'DELIVERY_STATUS',
  PROMOTION = 'PROMOTION',
  REVIEW_REPLY = 'REVIEW_REPLY',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
}

export enum NotificationChannel {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: any; // JSONB - additional data
  is_read: boolean;
  read_at: string | null;
  sent_via: NotificationChannel[];
  created_at: string;
  updated_at: string;
}

export interface GetNotificationsRequest {
  is_read?: boolean;
  page?: number;
  limit?: number;
}

export interface GetNotificationsResponse {
  items: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next_page: boolean;
  };
}
