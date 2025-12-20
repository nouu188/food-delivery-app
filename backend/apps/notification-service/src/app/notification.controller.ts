import { Controller, Get, Put, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '@backend/common';
import { NotificationQueryDto, NotificationType } from '@backend/shared';
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

  @Get()
  @MessagePattern(NOTIFICATION_PATTERNS.GET_USER_NOTIFICATIONS)
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(@Request() req: any, @Query() query: NotificationQueryDto) {
    return this.notificationService.getUserNotifications(req.user.id, query.type, query.is_read, query.page, query.limit);
  }

  @Put(':id/read')
  @MessagePattern(NOTIFICATION_PATTERNS.MARK_AS_READ)
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationService.markAsRead(req.user.id, id);
  }

  @Put('read-all')
  @MessagePattern(NOTIFICATION_PATTERNS.MARK_ALL_AS_READ)
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(@Request() req: any) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @MessagePattern(NOTIFICATION_PATTERNS.DELETE_NOTIFICATION)
  @UseGuards(JwtAuthGuard)
  async deleteNotification(@Request() req: any, @Param('id') id: string) {
    return this.notificationService.deleteNotification(req.user.id, id);
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
