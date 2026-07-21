export const notificationsService = {
  async getNotifications() {
    return Promise.resolve([
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
    ]);
  },
};
