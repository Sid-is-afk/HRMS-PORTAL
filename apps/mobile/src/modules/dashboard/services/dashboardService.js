import axiosInstance from '@/api/axios';

const ENDPOINTS = {
  SUMMARY: '/dashboard/summary',
  ANNOUNCEMENTS: '/dashboard/announcements',
  HOLIDAYS: '/dashboard/holidays',
};

export const dashboardService = {
  getDashboardSummary: async () => {
    // For now, simulate network response since backend is not ready
    // const response = await axiosInstance.get(ENDPOINTS.SUMMARY);
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          attendance: {
            status: 'Present',
            checkIn: '09:00 AM',
            checkOut: '--:--'
          },
          leaveBalance: {
            annual: 12,
            sick: 5,
            casual: 3
          }
        });
      }, 500);
    });
  },

  getAnnouncements: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', title: 'Townhall Meeting', date: 'Oct 25, 2026', type: 'Event' },
          { id: '2', title: 'Office closed on Friday', date: 'Oct 30, 2026', type: 'Holiday' }
        ]);
      }, 600);
    });
  },

  getUpcomingHolidays: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Diwali', date: 'Nov 12, 2026' }
        ]);
      }, 700);
    });
  }
};
