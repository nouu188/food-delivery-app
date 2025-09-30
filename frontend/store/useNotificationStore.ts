import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Notification {
  id: string;
  icon: string;
  message: string;
  createdAt: number;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

// Mock data ví dụ
const mockNotifications: Notification[] = [
  {
    id: "1",
    icon: "bell",
    message: "Welcome! Đây là thông báo đầu tiên của bạn 🎉",
    createdAt: Date.now() - 1000 * 60 * 60, // 1 giờ trước
    read: false,
  },
  {
    id: "2",
    icon: "mail",
    message: "Bạn có 3 tin nhắn mới 📩",
    createdAt: Date.now() - 1000 * 60 * 30, // 30 phút trước
    read: false,
  },
  {
    id: "3",
    icon: "calendar",
    message: "Lịch hẹn của bạn sẽ diễn ra vào ngày mai 📅",
    createdAt: Date.now() - 1000 * 60 * 5, // 5 phút trước
    read: false,
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      // Khi chưa có data trong AsyncStorage → khởi tạo bằng mock data
      notifications: mockNotifications,

      addNotification: (notification) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          createdAt: Date.now(),
          ...notification,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: "notifications",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
