import { NotificationType } from '@backend/shared';
export class NotificationSentEvent {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly sentVia: string[],
  ) {}
}
