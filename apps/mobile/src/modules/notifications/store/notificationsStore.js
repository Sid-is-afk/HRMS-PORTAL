import { create } from 'zustand';

const initialNotifications = [
  {
    id: '1',
    title: 'Leave request approved',
    message: 'Your leave request for 15 Jul has been approved by HR.',
    type: 'info',
    createdAt: '2024-07-15T09:00:00.000Z',
    read: false,
  },
  {
    id: '2',
    title: 'Company announcement',
    message: 'The office will be closed for maintenance on 20 Jul from 10 AM.',
    type: 'announcement',
    createdAt: '2024-07-14T14:30:00.000Z',
    read: true,
  },
  {
    id: '3',
    title: 'Payroll reminder',
    message: 'Please verify your bank details before the payroll run.',
    type: 'reminder',
    createdAt: '2024-07-13T08:15:00.000Z',
    read: false,
  },
];

export const useNotificationsStore = create((set, get) => ({
  notifications: initialNotifications,
  announcements: initialNotifications.filter((item) => item.type === 'announcement'),
  unreadCount: initialNotifications.filter((item) => !item.read).length,

  markAsRead: (id) => {
    const nextNotifications = get().notifications.map((item) =>
      item.id === id ? { ...item, read: true } : item,
    );

    set({
      notifications: nextNotifications,
      announcements: nextNotifications.filter((item) => item.type === 'announcement'),
      unreadCount: nextNotifications.filter((item) => !item.read).length,
    });
  },

  markAllAsRead: () => {
    const nextNotifications = get().notifications.map((item) => ({ ...item, read: true }));
    set({
      notifications: nextNotifications,
      announcements: nextNotifications.filter((item) => item.type === 'announcement'),
      unreadCount: 0,
    });
  },
}));
