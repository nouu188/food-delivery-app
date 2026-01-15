import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '@/services/api/notification.service';
import { Notification } from '@/types/api/notification';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;

  fetchNotifications: (isRead?: boolean) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;

  get unreadCount(): number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,

      fetchNotifications: async (isRead?: boolean) => {
        set({ isLoading: true, error: null });
        try {
          const response = await notificationService.getNotifications({
            is_read: isRead,
            page: 1,
            limit: 50,
          });
          set({
            notifications: Array.isArray(response?.items) ? response.items : [],
            isLoading: false
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false, notifications: [] });
        }
      },

      markAsRead: async (id) => {
        try {
          await notificationService.markAsRead(id);
          set((state) => ({
            notifications: Array.isArray(state.notifications)
              ? state.notifications.map((n) =>
                  n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
                )
              : [],
          }));
        } catch (error: any) {
          console.log('[Notification] Mark as read error:', error);
        }
      },

      markAllAsRead: async () => {
        try {
          await notificationService.markAllAsRead();
          set((state) => ({
            notifications: Array.isArray(state.notifications)
              ? state.notifications.map((n) => ({
                  ...n,
                  is_read: true,
                  read_at: new Date().toISOString(),
                }))
              : [],
          }));
        } catch (error: any) {
          console.log('[Notification] Mark all as read error:', error);
        }
      },

      deleteNotification: async (id) => {
        try {
          await notificationService.deleteNotification(id);
          set((state) => ({
            notifications: Array.isArray(state.notifications)
              ? state.notifications.filter((n) => n.id !== id)
              : [],
          }));
        } catch (error: any) {
          console.log('[Notification] Delete notification error:', error);
        }
      },

      get unreadCount() {
        const notifications = get().notifications;
        return Array.isArray(notifications)
          ? notifications.filter((n) => !n.is_read).length
          : 0;
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        notifications: Array.isArray(state.notifications) ? state.notifications : [],
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !Array.isArray(state.notifications)) {
          state.notifications = [];
        }
      },
    }
  )
);
