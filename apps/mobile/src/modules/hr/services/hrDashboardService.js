import { apiClient } from '@/api/client/apiClient';
import { USE_REAL_HR_API } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockSummary = {
  openPositions: 12,
  candidates: 48,
  upcomingInterviews: 5,
  pendingOnboarding: 8,
  pendingConfirmations: 3,
  employeesOnProbation: 14,
  upcomingReviews: 6,
  trainingStatus: 78,
  expiringDocuments: 2,
  pendingWorkflowApprovals: 4,
  upcomingBirthdays: 3,
  upcomingWorkAnniversaries: 1,
};

const mockTasks = [
  {
    id: 'task-1',
    title: 'Review Leave Request - Aarav Patel',
    description: 'Aarav Patel has requested 3 days of Annual Leave starting August 5th.',
    dueDate: '2026-08-01T18:00:00Z',
    priority: 'HIGH',
  },
  {
    id: 'task-2',
    title: 'Conduct Onboarding Buddy Check-in',
    description: 'Follow up with Priya Sharma regarding onboarding progress.',
    dueDate: '2026-08-03T12:00:00Z',
    priority: 'MEDIUM',
  },
  {
    id: 'task-3',
    title: 'Verify Expiring Visa Documents',
    description: "John Smith's work visa document is expiring in 30 days.",
    dueDate: '2026-08-05T09:00:00Z',
    priority: 'HIGH',
  },
  {
    id: 'task-4',
    title: 'Approve Recruitment Job Requisition',
    description: 'QA Engineer requisition requires second-level HR approval.',
    dueDate: '2026-08-02T17:00:00Z',
    priority: 'MEDIUM',
  },
  {
    id: 'task-5',
    title: 'Publish Monthly HR Newsletter',
    description: 'Draft and release the monthly organization updates.',
    dueDate: '2026-08-10T15:00:00Z',
    priority: 'LOW',
  },
];

const mockEvents = [
  {
    id: 'event-1',
    type: 'BIRTHDAY',
    title: "Aarav Patel's Birthday",
    description: 'Send birthday wishes to Aarav from the HR portal.',
    date: '2026-08-01',
  },
  {
    id: 'event-2',
    type: 'ANNIVERSARY',
    title: "Mina Rao's Work Anniversary",
    description: 'Celebrating 3 years of service today!',
    date: '2026-08-02',
  },
  {
    id: 'event-3',
    type: 'INTERVIEW',
    title: 'Technical Interview: Rohan Sen',
    description: 'Position: Senior Mobile Engineer. Time: 2:00 PM - 3:00 PM.',
    date: '2026-07-31',
  },
  {
    id: 'event-4',
    type: 'MEETING',
    title: 'HR Department Sync',
    description: 'Weekly alignment meeting with the HR team.',
    date: '2026-07-31',
  },
];

const mockActivities = [
  {
    id: 'act-1',
    type: 'RECRUITMENT',
    description: 'New candidate Rohan Sen applied for Senior Mobile Engineer position.',
    performedBy: 'System',
    timestamp: '2026-07-30T15:30:00Z',
  },
  {
    id: 'act-2',
    type: 'ONBOARDING',
    description: 'Onboarding workflow initiated for Priya Sharma.',
    performedBy: 'Mina Rao',
    timestamp: '2026-07-30T14:15:00Z',
  },
  {
    id: 'act-3',
    type: 'PERFORMANCE',
    description: 'Performance review completed for John Smith.',
    performedBy: 'Aarav Patel',
    timestamp: '2026-07-30T11:00:00Z',
  },
  {
    id: 'act-4',
    type: 'TRAINING',
    description: "Assigned course 'Information Security 101' to 5 new hires.",
    performedBy: 'HR Admin',
    timestamp: '2026-07-30T09:45:00Z',
  },
  {
    id: 'act-5',
    type: 'DOCUMENT',
    description: 'Uploaded updated Employee Handbook for FY26.',
    performedBy: 'Mina Rao',
    timestamp: '2026-07-30T09:00:00Z',
  },
];

const mockQuickActions = [
  {
    id: 'qa-1',
    label: 'Create Job',
    icon: 'briefcase-plus-outline',
    route: 'CreateJobOpening',
  },
  {
    id: 'qa-2',
    label: 'Add Candidate',
    icon: 'account-plus-outline',
    route: 'AddCandidate',
  },
  {
    id: 'qa-3',
    label: 'Onboard',
    icon: 'account-clock-outline',
    route: 'StartOnboarding',
  },
  {
    id: 'qa-4',
    label: 'Assign Training',
    icon: 'school-outline',
    route: 'AssignTraining',
  },
  {
    id: 'qa-5',
    label: 'Performance Review',
    icon: 'file-document-edit-outline',
    route: 'CreatePerformanceReview',
  },
  {
    id: 'qa-6',
    label: 'Upload Document',
    icon: 'file-upload-outline',
    route: 'UploadDocument',
  },
];

const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Pending Approvals Alert',
    body: 'You have 4 workflows waiting for approval.',
    isRead: false,
    type: 'WORKFLOW',
  },
  {
    id: 'notif-2',
    title: 'Milestone Celebrations',
    body: '3 birthdays and 1 work anniversary this week.',
    isRead: true,
    type: 'SYSTEM',
  },
  {
    id: 'notif-3',
    title: 'System Update Complete',
    body: 'HRMS Portal has been successfully updated to version 0.1.0.',
    isRead: true,
    type: 'SYSTEM',
  },
];

export const hrDashboardService = {
  getHRDashboard: async () => {
    if (!USE_REAL_HR_API) {
      await delay(500);
      return mockSummary;
    }
    const response = await apiClient.get('/hr/dashboard/summary');
    return response?.data || response;
  },

  getPendingTasks: async () => {
    if (!USE_REAL_HR_API) {
      await delay(400);
      return mockTasks;
    }
    const response = await apiClient.get('/hr/dashboard/tasks');
    return response?.data || response;
  },

  getUpcomingEvents: async () => {
    if (!USE_REAL_HR_API) {
      await delay(400);
      return mockEvents;
    }
    const response = await apiClient.get('/hr/dashboard/events');
    return response?.data || response;
  },

  getRecentActivities: async () => {
    if (!USE_REAL_HR_API) {
      await delay(300);
      return mockActivities;
    }
    const response = await apiClient.get('/hr/dashboard/activities');
    return response?.data || response;
  },

  getQuickActions: async () => {
    if (!USE_REAL_HR_API) {
      await delay(300);
      return mockQuickActions;
    }
    const response = await apiClient.get('/hr/dashboard/quick-actions');
    return response?.data || response;
  },

  getNotifications: async () => {
    if (!USE_REAL_HR_API) {
      await delay(400);
      return mockNotifications;
    }
    const response = await apiClient.get('/hr/dashboard/notifications');
    return response?.data || response;
  },
};

