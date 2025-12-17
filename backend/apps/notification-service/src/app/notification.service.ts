import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Notification } from '@backend/database';
import { NotificationType, NotificationSentVia } from '@backend/shared';
import { NotificationSentEvent, NOTIFICATION_EVENTS } from '@backend/contracts';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createNotification(userId: string, type: NotificationType, title: string, body: string, data?: any, sentVia?: NotificationSentVia[]) {
    const notification = this.notificationRepository.create({
      user_id: userId,
      type,
      title,
      body,
      data: data || {},
      sent_via: sentVia || [NotificationSentVia.PUSH],
      is_read: false,
    });

    await this.notificationRepository.save(notification);

    this.eventEmitter.emit(
      NOTIFICATION_EVENTS.SENT,
      new NotificationSentEvent(notification.id, userId, type, sentVia)
    );

    return notification;
  }

  async getUserNotifications(userId: string, type?: NotificationType, isRead?: boolean, page = 1, limit = 20) {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .where('notification.user_id = :userId', { userId });

    if (type) {
      queryBuilder.andWhere('notification.type = :type', { type });
    }

    if (isRead !== undefined) {
      queryBuilder.andWhere('notification.is_read = :isRead', { isRead });
    }

    const total = await queryBuilder.getCount();

    const unreadCount = await this.notificationRepository.count({
      where: { user_id: userId, is_read: false },
    });

    const data = await queryBuilder
      .orderBy('notification.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      unread_count: unreadCount,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, user_id: userId },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.is_read = true;
    notification.read_at = new Date();

    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { user_id: userId, is_read: false },
      { is_read: true, read_at: new Date() }
    );

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(userId: string, notificationId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationRepository.remove(notification);

    return { message: 'Notification deleted successfully' };
  }

  async sendOrderNotification(userId: string, orderId: string, status: string) {
    const titleMap = {
      CONFIRMED: 'Order Confirmed',
      PREPARING: 'Order Being Prepared',
      READY_FOR_PICKUP: 'Order Ready for Pickup',
      PICKED_UP: 'Order Picked Up',
      ON_THE_WAY: 'Order on the Way',
      DELIVERED: 'Order Delivered',
      CANCELLED: 'Order Cancelled',
    };

    const bodyMap = {
      CONFIRMED: 'Your order has been confirmed by the restaurant',
      PREPARING: 'Your order is being prepared',
      READY_FOR_PICKUP: 'Your order is ready for pickup',
      PICKED_UP: 'Driver has picked up your order',
      ON_THE_WAY: 'Your order is on the way',
      DELIVERED: 'Your order has been delivered',
      CANCELLED: 'Your order has been cancelled',
    };

    return this.createNotification(
      userId,
      NotificationType.ORDER_UPDATE,
      titleMap[status] || 'Order Update',
      bodyMap[status] || 'Your order status has been updated',
      { order_id: orderId, status },
      [NotificationSentVia.PUSH]
    );
  }
}
