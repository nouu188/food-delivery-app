export class NotificationSentEvent {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly type: string,
    public readonly sentVia: string[],
  ) {}
}
