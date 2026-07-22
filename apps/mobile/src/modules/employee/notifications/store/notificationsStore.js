import { create } from 'zustand';
import { notificationsService } from '../services/notificationsService';

const initialState = {
  notifications: [],
  announcements: [],
  unreadCount: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,
};

export const useNotificationsStore = create((set, get) => ({
  ...initialState,

  fetchNotifications: async (refresh = false) => {
    if (refresh) {
      set({ isRefreshing: true, error: null });
    } else {
      set({ isLoading: true, error: null });
    }

    try {
      const data = await notificationsService.getNotifications();
      set({
        notifications: data || [],
        announcements: (data || []).filter((item) => item.type === 'announcement'),
        unreadCount: (data || []).filter((item) => !item.read).length,
        isLoading: false,
        isRefreshing: false,
      });
    } catch (err) {
      set({
        error: err.message || 'Failed to fetch notifications',
        isLoading: false,
        isRefreshing: false,
      });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationsService.markAsRead(id);
      const nextNotifications = get().notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item
      );

      set({
        notifications: nextNotifications,
        announcements: nextNotifications.filter((item) => item.type === 'announcement'),
        unreadCount: nextNotifications.filter((item) => !item.read).length,
      });
    } catch (err) {
      set({ error: err.message || 'Failed to mark notification as read' });
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsService.markAllAsRead();
      const nextNotifications = get().notifications.map((item) => ({ ...item, read: true }));
      set({
        notifications: nextNotifications,
        announcements: nextNotifications.filter((item) => item.type === 'announcement'),
        unreadCount: 0,
      });
    } catch (err) {
      set({ error: err.message || 'Failed to mark all notifications as read' });
    }
  },

  clearError: () => set({ error: null }),
}));

