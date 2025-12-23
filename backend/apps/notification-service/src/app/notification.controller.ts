import { Controller, Get } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { NotificationType } from '@backend/shared';
import { NOTIFICATION_PATTERNS, ORDER_EVENTS, PAYMENT_EVENTS, REVIEW_EVENTS } from '@backend/contracts';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'notification-service',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(NOTIFICATION_PATTERNS.GET_USER_NOTIFICATIONS)
  async getUserNotifications(data: any) {
    return this.notificationService.getUserNotifications(data.userId, data.type, data.is_read, data.page, data.limit);
  }

  @MessagePattern(NOTIFICATION_PATTERNS.MARK_AS_READ)
  async markAsRead(data: { userId: string; id: string }) {
    return this.notificationService.markAsRead(data.userId, data.id);
  }

  @MessagePattern(NOTIFICATION_PATTERNS.MARK_ALL_AS_READ)
  async markAllAsRead(data: { userId: string }) {
    return this.notificationService.markAllAsRead(data.userId);
  }

  @MessagePattern(NOTIFICATION_PATTERNS.DELETE_NOTIFICATION)
  async deleteNotification(data: { userId: string; id: string }) {
    return this.notificationService.deleteNotification(data.userId, data.id);
  }

  @EventPattern(ORDER_EVENTS.CREATED)
  async handleOrderCreated(data: any) {
    await this.notificationService.sendOrderNotification(data.userId, data.orderId, 'CONFIRMED');
  }

  @EventPattern(ORDER_EVENTS.STATUS_CHANGED)
  async handleOrderStatusChanged(data: any) {
    await this.notificationService.sendOrderNotification(data.userId, data.orderId, data.newStatus);
  }

  @EventPattern(PAYMENT_EVENTS.COMPLETED)
  async handlePaymentCompleted(data: any) {
    await this.notificationService.createNotification(
      data.userId,
      NotificationType.SYSTEM,
      'Payment Successful',
      `Payment of ${data.amount} has been processed successfully`,
      { payment_id: data.paymentId }
    );
  }

  @EventPattern(REVIEW_EVENTS.CREATED)
  async handleReviewCreated(data: any) {
    await this.notificationService.createNotification(
      data.restaurantOwnerId,
      NotificationType.REVIEW,
      'New Review',
      'You have received a new review for your restaurant',
      { review_id: data.reviewId }
    );
  }
}
