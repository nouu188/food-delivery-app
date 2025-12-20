import apiClient from './client';
import { Notification, GetNotificationsRequest, GetNotificationsResponse } from '@/types/api/notification';

class NotificationService {
  async getNotifications(params?: GetNotificationsRequest): Promise<GetNotificationsResponse> {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  }

  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllAsRead(): Promise<{ message: string }> {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  }

  async deleteNotification(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  }
}

export default new NotificationService();
