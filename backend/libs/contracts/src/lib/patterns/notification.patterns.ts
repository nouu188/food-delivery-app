export const NOTIFICATION_PATTERNS = {
  GET_USER_NOTIFICATIONS: { cmd: 'notification.user.get' },
  MARK_AS_READ: { cmd: 'notification.read.mark' },
  MARK_ALL_AS_READ: { cmd: 'notification.read.mark.all' },
  DELETE_NOTIFICATION: { cmd: 'notification.delete' },
} as const;
