import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard, AuthenticatedRequest } from '@backend/common';
import { NOTIFICATION_PATTERNS } from '@backend/contracts';
import { NotificationQueryDto } from '@backend/shared';

@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly notificationService: ClientProxy
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(@Request() req: AuthenticatedRequest, @Query() query: NotificationQueryDto) {
    try {
      return await firstValueFrom(
        this.notificationService.send(NOTIFICATION_PATTERNS.GET_USER_NOTIFICATIONS, {
          userId: req.user.id,
          ...query,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get notifications',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal notification error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.notificationService.send(NOTIFICATION_PATTERNS.MARK_AS_READ, {
          userId: req.user.id,
          notificationId: id,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Notification not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update this notification',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to mark notification as read',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal notification error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('read-all')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(@Request() req: AuthenticatedRequest) {
    try {
      return await firstValueFrom(
        this.notificationService.send(NOTIFICATION_PATTERNS.MARK_ALL_AS_READ, {
          userId: req.user.id,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to mark all notifications as read',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal notification error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteNotification(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.notificationService.send(NOTIFICATION_PATTERNS.DELETE_NOTIFICATION, {
          userId: req.user.id,
          notificationId: id,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Notification not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to delete this notification',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to delete notification',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal notification error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
