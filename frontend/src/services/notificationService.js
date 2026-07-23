import api from '../config/axios';

export const notificationService = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
  markAsRead: async (publicId) => {
    const response = await api.put(`/notifications/${publicId}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
  delete: async (publicId) => {
    const response = await api.delete(`/notifications/${publicId}`);
    return response.data;
  },
};
