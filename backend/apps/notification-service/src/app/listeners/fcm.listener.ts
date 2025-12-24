import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '@backend/database';
import { NotificationSentEvent, NOTIFICATION_EVENTS } from '@backend/contracts';
import { NotificationSentVia } from '@backend/shared';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FcmListener {
  private readonly logger = new Logger(FcmListener.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  @OnEvent(NOTIFICATION_EVENTS.SENT)
  async handleNotificationSent(event: NotificationSentEvent) {
    try {
      this.logger.log(`Received notification sent event for notification ID: ${event.notificationId}`);

      // Check if notification should be sent via push
      if (!event.sentVia.includes(NotificationSentVia.PUSH)) {
        this.logger.log(`Notification ${event.notificationId} is not configured for PUSH - skipping FCM`);
        return;
      }

      // Fetch the full notification from database to get title, body, and data
      const notification = await this.notificationRepository.findOne({
        where: { id: event.notificationId },
      });

      if (!notification) {
        this.logger.error(`Notification ${event.notificationId} not found in database`);
        return;
      }

      this.logger.log(
        `Sending FCM notification to user ${event.userId}: "${notification.title}"`,
      );

      // Convert notification data to string map for FCM
      const fcmData: Record<string, string> = {
        notification_id: notification.id,
        type: notification.type,
      };

      // Add custom data if exists
      if (notification.data && typeof notification.data === 'object') {
        for (const [key, value] of Object.entries(notification.data)) {
          fcmData[key] = typeof value === 'string' ? value : JSON.stringify(value);
        }
      }

      // Send FCM notification
      const result = await this.firebaseService.sendNotification(
        event.userId,
        notification.title,
        notification.body,
        fcmData,
        notification.type,
      );

      if (result.successCount > 0) {
        this.logger.log(
          `Successfully sent FCM notification to ${result.successCount} device(s) for notification ${event.notificationId}`,
        );
      }

      if (result.failureCount > 0) {
        this.logger.warn(
          `Failed to send FCM notification to ${result.failureCount} device(s) for notification ${event.notificationId}`,
        );
      }

      if (result.invalidTokens.length > 0) {
        this.logger.warn(
          `Cleaned up ${result.invalidTokens.length} invalid token(s) for notification ${event.notificationId}`,
        );
      }
    } catch (error) {
      // Graceful degradation - log error but don't throw
      // Notification is already saved to DB, FCM is optional
      this.logger.error(
        `Failed to handle notification sent event for ${event.notificationId}: ${error.message}`,
      );
      this.logger.error(error.stack);
    }
  }
}
