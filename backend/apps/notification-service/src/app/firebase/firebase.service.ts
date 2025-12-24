import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { UserDevice } from '@backend/database';
import { NotificationType } from '@backend/shared';
import { getFirebaseMessaging } from './firebase.config';

export interface FCMSendResult {
  successCount: number;
  failureCount: number;
  invalidTokens: string[];
}

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private readonly dryRun: boolean;

  constructor(
    @InjectRepository(UserDevice)
    private readonly userDeviceRepository: Repository<UserDevice>,
    private readonly configService: ConfigService,
  ) {
    this.dryRun = this.configService.get<string>('FCM_DRY_RUN') === 'true';
    if (this.dryRun) {
      this.logger.warn('FCM is running in DRY RUN mode - notifications will not be sent');
    }
  }

  async sendNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
    notificationType?: NotificationType,
  ): Promise<FCMSendResult> {
    try {
      const messaging = getFirebaseMessaging();
      if (!messaging) {
        this.logger.warn('Firebase Messaging is not initialized - skipping FCM send');
        return { successCount: 0, failureCount: 0, invalidTokens: [] };
      }

      // Get user's active device tokens
      const tokens = await this.getUserDeviceTokens(userId);

      if (tokens.length === 0) {
        this.logger.log(`No active device tokens found for user: ${userId}`);
        return { successCount: 0, failureCount: 0, invalidTokens: [] };
      }

      this.logger.log(`Sending notification to ${tokens.length} device(s) for user: ${userId}`);

      // Build FCM message payload
      const message = this.buildFCMMessage(title, body, data, notificationType, tokens);

      // Send multicast message
      const result = await this.sendMulticast(message);

      // Handle invalid tokens
      if (result.invalidTokens.length > 0) {
        await this.handleInvalidTokens(result.invalidTokens);
      }

      this.logger.log(
        `FCM send completed - Success: ${result.successCount}, Failed: ${result.failureCount}, Invalid: ${result.invalidTokens.length}`,
      );

      return result;
    } catch (error) {
      this.logger.error(`Failed to send FCM notification: ${error.message}`);
      this.logger.error(error.stack);
      return { successCount: 0, failureCount: 0, invalidTokens: [] };
    }
  }

  async getUserDeviceTokens(userId: string): Promise<string[]> {
    try {
      const devices = await this.userDeviceRepository.find({
        where: {
          user_id: userId,
          is_active: true,
        },
      });

      return devices.map((device) => device.device_token);
    } catch (error) {
      this.logger.error(`Failed to fetch device tokens for user ${userId}: ${error.message}`);
      return [];
    }
  }

  private buildFCMMessage(
    title: string,
    body: string,
    data?: Record<string, string>,
    notificationType?: NotificationType,
    tokens?: string[],
  ): admin.messaging.MulticastMessage {
    // Get notification priority and channel based on type
    const { priority, channelId } = this.getNotificationConfig(notificationType);

    // Ensure all data values are strings (FCM requirement)
    const sanitizedData: Record<string, string> = {};
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        sanitizedData[key] = typeof value === 'string' ? value : JSON.stringify(value);
      }
    }

    const message: admin.messaging.MulticastMessage = {
      notification: {
        title,
        body,
      },
      data: sanitizedData,
      android: {
        priority: priority as 'high' | 'normal',
        notification: {
          channelId,
          sound: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          priority: priority as 'high' | 'default' | 'low' | 'min' | 'max',
        },
      },
      tokens: tokens || [],
    };

    return message;
  }

  private getNotificationConfig(type?: NotificationType): { priority: string; channelId: string } {
    switch (type) {
      case NotificationType.ORDER_UPDATE:
        return { priority: 'high', channelId: 'order_updates' };
      case NotificationType.PROMOTION:
        return { priority: 'normal', channelId: 'promotions' };
      case NotificationType.SYSTEM:
        return { priority: 'normal', channelId: 'system_alerts' };
      case NotificationType.REVIEW:
        return { priority: 'normal', channelId: 'reviews' };
      default:
        return { priority: 'normal', channelId: 'default' };
    }
  }

  private async sendMulticast(message: admin.messaging.MulticastMessage): Promise<FCMSendResult> {
    try {
      const messaging = getFirebaseMessaging();
      if (!messaging) {
        this.logger.warn('Firebase Messaging is not available');
        return { successCount: 0, failureCount: 0, invalidTokens: [] };
      }

      if (this.dryRun) {
        this.logger.log(`[DRY RUN] Would send to ${message.tokens.length} token(s):`);
        this.logger.log(`[DRY RUN] Title: ${message.notification?.title}`);
        this.logger.log(`[DRY RUN] Body: ${message.notification?.body}`);
        return { successCount: message.tokens.length, failureCount: 0, invalidTokens: [] };
      }

      const response = await messaging.sendEachForMulticast(message);

      const invalidTokens: string[] = [];

      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error) {
          const errorCode = resp.error.code;

          // Check for invalid or unregistered tokens
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            invalidTokens.push(message.tokens[idx]);
            this.logger.warn(`Invalid token detected: ${message.tokens[idx].substring(0, 20)}...`);
          } else {
            this.logger.error(`FCM send error for token ${idx}: ${resp.error.message}`);
          }
        }
      });

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokens,
      };
    } catch (error) {
      this.logger.error(`Failed to send multicast message: ${error.message}`);
      throw error;
    }
  }

  private async handleInvalidTokens(tokens: string[]): Promise<void> {
    try {
      if (tokens.length === 0) {
        return;
      }

      this.logger.log(`Marking ${tokens.length} invalid token(s) as inactive`);

      await this.userDeviceRepository.update(
        { device_token: In(tokens) },
        { is_active: false },
      );

      // Mark each invalid token as inactive
      for (const token of tokens) {
        await this.userDeviceRepository.update({ device_token: token }, { is_active: false });
      }

      this.logger.log(`Successfully marked ${tokens.length} token(s) as inactive`);
    } catch (error) {
      this.logger.error(`Failed to mark invalid tokens as inactive: ${error.message}`);
    }
  }

  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
    notificationType?: NotificationType,
  ): Promise<FCMSendResult> {
    try {
      const messaging = getFirebaseMessaging();
      if (!messaging) {
        this.logger.warn('Firebase Messaging is not initialized');
        return { successCount: 0, failureCount: 0, invalidTokens: [] };
      }

      if (tokens.length === 0) {
        this.logger.warn('No tokens provided to sendToTokens');
        return { successCount: 0, failureCount: 0, invalidTokens: [] };
      }

      const message = this.buildFCMMessage(title, body, data, notificationType, tokens);
      const result = await this.sendMulticast(message);

      if (result.invalidTokens.length > 0) {
        await this.handleInvalidTokens(result.invalidTokens);
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to send to tokens: ${error.message}`);
      return { successCount: 0, failureCount: 0, invalidTokens: [] };
    }
  }
}
