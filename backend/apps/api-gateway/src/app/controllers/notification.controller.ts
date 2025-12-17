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
    return firstValueFrom(
      this.notificationService.send(NOTIFICATION_PATTERNS.GET_USER_NOTIFICATIONS, {
        userId: req.user.id,
        ...query,
      })
    );
  }

  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return firstValueFrom(
      this.notificationService.send(NOTIFICATION_PATTERNS.MARK_AS_READ, {
        userId: req.user.id,
        notificationId: id,
      })
    );
  }

  @Put('read-all')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(@Request() req: AuthenticatedRequest) {
    return firstValueFrom(
      this.notificationService.send(NOTIFICATION_PATTERNS.MARK_ALL_AS_READ, {
        userId: req.user.id,
      })
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteNotification(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return firstValueFrom(
      this.notificationService.send(NOTIFICATION_PATTERNS.DELETE_NOTIFICATION, {
        userId: req.user.id,
        notificationId: id,
      })
    );
  }
}
