/**
 * Centralized Mock Data Repository for HRMS Portal.
 * Serves as the single source of truth for mock payloads to ensure API contract standardization.
 */

export const mockData = {
  auth: {
    loginResponse: {
      accessToken: 'mock-access-token-jwt-string',
      refreshToken: 'mock-refresh-token-jwt-string',
      user: {
        id: 'emp-001',
        employeeId: 'EMP00001',
        firstName: 'Aarav',
        lastName: 'Patel',
        email: 'aarav.patel@company.com',
        role: 'EMPLOYEE',
      },
    },
    validateResponse: {
      valid: true,
      user: {
        id: 'emp-001',
        employeeId: 'EMP00001',
        firstName: 'Aarav',
        lastName: 'Patel',
        email: 'aarav.patel@company.com',
        role: 'EMPLOYEE',
      },
    },
  },

  dashboard: {
    summary: {
      attendance: {
        status: 'Present',
        checkIn: '09:00 AM',
        checkOut: '--:--',
      },
      leaveBalance: {
        annual: 12,
        sick: 5,
        casual: 3,
      },
    },
    announcements: [
      { id: '1', title: 'Townhall Meeting', date: '2026-10-25T10:00:00.000Z', type: 'Event' },
      { id: '2', title: 'Office closed on Friday', date: '2026-10-30T00:00:00.000Z', type: 'Holiday' },
    ],
    holidays: [
      { id: '1', name: 'Diwali', date: '2026-11-12' },
    ],
  },

  attendance: {
    today: {
      status: 'NOT_MARKED', // NOT_MARKED, CLOCKED_IN, CLOCKED_OUT
      checkIn: null,
      checkOut: null,
      hoursWorked: 0,
    },
    summary: {
      totalDays: 30,
      present: 20,
      absent: 2,
      onLeave: 2,
      late: 1,
      holidays: 1,
      weekends: 4,
    },
    history: [
      { id: 'att-1', date: '2026-07-20', status: 'Present', checkIn: '2026-07-20T09:05:00.000Z', checkOut: '2026-07-20T17:15:00.000Z', hoursWorked: 8.17 },
      { id: 'att-2', date: '2026-07-19', status: 'Present', checkIn: '2026-07-19T08:58:00.000Z', checkOut: '2026-07-19T17:02:00.000Z', hoursWorked: 8.07 },
      { id: 'att-3', date: '2026-07-18', status: 'Weekend', checkIn: null, checkOut: null, hoursWorked: 0 },
      { id: 'att-4', date: '2026-07-17', status: 'Weekend', checkIn: null, checkOut: null, hoursWorked: 0 },
      { id: 'att-5', date: '2026-07-16', status: 'On Leave', checkIn: null, checkOut: null, hoursWorked: 0 },
      { id: 'att-6', date: '2026-07-15', status: 'Present', checkIn: '2026-07-15T09:12:00.000Z', checkOut: '2026-07-15T18:00:00.000Z', hoursWorked: 8.8 },
      { id: 'att-7', date: '2026-07-14', status: 'Present', checkIn: '2026-07-14T09:00:00.000Z', checkOut: '2026-07-14T17:00:00.000Z', hoursWorked: 8.0 },
      { id: 'att-8', date: '2026-07-13', status: 'Present', checkIn: '2026-07-13T09:02:00.000Z', checkOut: '2026-07-13T17:05:00.000Z', hoursWorked: 8.05 },
    ],
  },

  leave: {
    balance: {
      total: 24,
      used: 8,
      remaining: 16,
      pending: 2,
    },
    types: [
      { id: 'annual', label: 'Annual Leave', description: 'Planned annual leave' },
      { id: 'sick', label: 'Sick Leave', description: 'Medical leave' },
      { id: 'personal', label: 'Personal Leave', description: 'Personal time' },
      { id: 'emergency', label: 'Emergency Leave', description: 'Urgent family or personal matters' },
    ],
    history: [
      {
        id: 'leave-001',
        leaveType: 'Annual Leave',
        startDate: '2026-07-20',
        endDate: '2026-07-22',
        halfDay: false,
        reason: 'Planned vacation with family.',
        status: 'PENDING',
        duration: 3,
        createdAt: '2026-07-16T08:15:00.000Z',
      },
      {
        id: 'leave-002',
        leaveType: 'Sick Leave',
        startDate: '2026-06-12',
        endDate: '2026-06-13',
        halfDay: true,
        reason: 'Medical follow-up and rest.',
        status: 'APPROVED',
        duration: 1,
        createdAt: '2026-06-10T09:30:00.000Z',
      },
      {
        id: 'leave-003',
        leaveType: 'Personal Leave',
        startDate: '2026-05-05',
        endDate: '2026-05-05',
        halfDay: false,
        reason: 'Personal errands.',
        status: 'REJECTED',
        duration: 1,
        createdAt: '2026-05-02T14:00:00.000Z',
      },
    ],
  },

  profile: {
    main: {
      id: 'emp-001',
      employeeId: 'EMP00001',
      firstName: 'Aarav',
      lastName: 'Patel',
      email: 'aarav.patel@company.com',
      phone: '+91 98765 43210',
      avatarUrl: null,
      department: 'Engineering',
      designation: 'Senior Mobile Engineer',
      managerName: 'Mina Rao',
      joiningDate: '2023-05-15',
      location: 'Bengaluru',
      address: '12, MG Road, Bengaluru',
    },
    employment: {
      employeeId: 'EMP00001',
      department: 'Engineering',
      designation: 'Senior Mobile Engineer',
      managerName: 'Mina Rao',
      joiningDate: '2023-05-15',
      employmentStatus: 'ACTIVE',
    },
    contacts: [
      {
        id: 'emg-1',
        name: 'Asha Patel',
        relationship: 'Mother',
        phone: '+91 99887 66554',
      },
    ],
    documents: [
      { id: 'doc-1', name: 'Offer Letter', type: 'offer', uploadedAt: '2023-05-01' },
      { id: 'doc-2', name: 'ID Proof', type: 'id', uploadedAt: '2023-05-02' },
    ],
    account: {
      email: 'aarav.patel@company.com',
      phone: '+91 98765 43210',
      lastPasswordChange: '2026-06-01',
      twoFactorEnabled: false,
    },
  },

  notifications: [
    {
      id: '1',
      title: 'Leave request approved',
      message: 'Your leave request for 15 Jul has been approved by HR.',
      type: 'info',
      createdAt: '2026-07-15T09:00:00.000Z',
      read: false,
    },
    {
      id: '2',
      title: 'Company announcement',
      message: 'The office will be closed for maintenance on 20 Jul from 10 AM.',
      type: 'announcement',
      createdAt: '2026-07-14T14:30:00.000Z',
      read: true,
    },
    {
      id: '3',
      title: 'Payroll reminder',
      message: 'Please verify your bank details before the payroll run.',
      type: 'reminder',
      createdAt: '2026-07-13T08:15:00.000Z',
      read: false,
    },
  ],

  settings: {
    preferences: {
      theme: 'system',
      language: 'en',
    },
    notificationPreferences: {
      push: true,
      email: true,
      sms: false,
    },
    privacySettings: {
      profileVisibility: 'employees',
      showOnlineStatus: true,
    },
    securitySettings: {
      twoFactorEnabled: false,
      biometricsEnabled: false,
    },
  },
};
