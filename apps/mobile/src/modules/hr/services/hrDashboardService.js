import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockHRDashboardData = {
  summary: {
    openPositions: 8,
    candidates: 45,
    upcomingInterviews: 12,
    pendingOnboarding: 5,
    pendingConfirmations: 3,
    employeesOnProbation: 14,
    upcomingReviews: 6,
    expiringDocuments: 2,
    trainingStatus: 72, // e.g. 72% compliance rate
    recentActivitiesCount: 15,
    pendingWorkflowApprovals: 4,
    upcomingBirthdays: 3,
    upcomingWorkAnniversaries: 2,
  },
  tasks: [
    { id: 'hrt-1', title: 'Schedule interview for Aarav', description: 'Technical round for Senior React Developer', dueDate: new Date(Date.now() + 86400000).toISOString(), status: 'PENDING', priority: 'HIGH', category: 'RECRUITMENT' },
    { id: 'hrt-2', title: 'Start onboarding for Priya', description: 'Send contract and prepare workstation', dueDate: new Date(Date.now() + 172800000).toISOString(), status: 'PENDING', priority: 'MEDIUM', category: 'ONBOARDING' },
    { id: 'hrt-3', title: 'Review performance logs', description: 'Q2 Performance reviews evaluation due', dueDate: new Date(Date.now() + 259200000).toISOString(), status: 'PENDING', priority: 'HIGH', category: 'PERFORMANCE' },
    { id: 'hrt-4', title: 'Verify visa document for Jack', description: 'Verify expiring work authorization', dueDate: new Date(Date.now() + 345600000).toISOString(), status: 'IN_PROGRESS', priority: 'MEDIUM', category: 'DOCUMENTS' },
  ],
  activities: [
    { id: 'hra-1', type: 'RECRUITMENT', description: 'New candidate profile created: Neha Sen', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), performedBy: 'System Parser' },
    { id: 'hra-2', type: 'ONBOARDING', description: 'Onboarding checklist initiated for Rohit Kumar', timestamp: new Date(Date.now() - 180 * 60000).toISOString(), performedBy: 'HR Agent' },
    { id: 'hra-3', type: 'PERFORMANCE', description: 'Performance appraisal template assigned to QA Team', timestamp: new Date(Date.now() - 360 * 60000).toISOString(), performedBy: 'HR Manager' },
    { id: 'hra-4', type: 'TRAINING', description: 'Cybersecurity Awareness training launched', timestamp: new Date(Date.now() - 720 * 60000).toISOString(), performedBy: 'System Admin' },
  ],
  events: [
    { id: 'hre-1', title: 'Neha Sharma birthday', date: new Date(Date.now() + 86400000).toISOString(), type: 'BIRTHDAY', description: 'Turning 28!', associatedUser: 'Neha Sharma' },
    { id: 'hre-2', title: 'Amit Patel anniversary', date: new Date(Date.now() + 172800000).toISOString(), type: 'ANNIVERSARY', description: '3 years of service', associatedUser: 'Amit Patel' },
    { id: 'hre-3', title: 'Vikas Kumar Interview', date: new Date(Date.now() + 43200000).toISOString(), type: 'INTERVIEW', description: 'Product Designer round 1', associatedUser: 'Vikas Kumar' },
  ],
  quickActions: [
    { id: 'hqa-job', label: 'Create Job Opening', icon: 'briefcase-plus-outline', route: 'CreateJobOpening', permission: 'VIEW_RECRUITMENT', isConfigurable: true },
    { id: 'hqa-cand', label: 'Add Candidate', icon: 'account-plus-outline', route: 'AddCandidate', permission: 'VIEW_RECRUITMENT', isConfigurable: true },
    { id: 'hqa-onb', label: 'Start Onboarding', icon: 'account-clock-outline', route: 'StartOnboarding', permission: 'VIEW_ONBOARDING', isConfigurable: true },
    { id: 'hqa-train', label: 'Assign Training', icon: 'school-outline', route: 'AssignTraining', permission: 'VIEW_TRAINING', isConfigurable: true },
    { id: 'hqa-perf', label: 'Create Review', icon: 'file-check-outline', route: 'CreatePerformanceReview', permission: 'VIEW_PERFORMANCE', isConfigurable: true },
    { id: 'hqa-doc', label: 'Upload Document', icon: 'file-upload-outline', route: 'UploadDocument', permission: 'VIEW_DOCUMENTS', isConfigurable: true },
    { id: 'hqa-rep', label: 'Generate HR Report', icon: 'file-chart-outline', route: 'GenerateHRReport', permission: 'VIEW_HR_DASHBOARD', isConfigurable: true },
  ],
  notifications: [
    { id: 'hrn-1', title: 'Workflow Overdue', body: 'Onboarding approval for Suresh is pending action for 3 days.', isRead: false, createdAt: new Date(Date.now() - 120 * 60000).toISOString(), type: 'WORKFLOW' },
    { id: 'hrn-2', title: 'Document Expiring', body: 'John Doe\'s Passport is expiring in 30 days.', isRead: false, createdAt: new Date(Date.now() - 1440 * 60000).toISOString(), type: 'ALERT' },
  ],
};

export const hrDashboardService = {
  getHRDashboard: async () => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockHRDashboardData.summary;
    }
    const response = await apiClient.get('/hr/dashboard/summary');
    return response?.data || response;
  },

  getPendingTasks: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockHRDashboardData.tasks;
    }
    const response = await apiClient.get('/hr/dashboard/tasks');
    return response?.data || response;
  },

  getUpcomingEvents: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockHRDashboardData.events;
    }
    const response = await apiClient.get('/hr/dashboard/events');
    return response?.data || response;
  },

  getRecentActivities: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockHRDashboardData.activities;
    }
    const response = await apiClient.get('/hr/dashboard/activities');
    return response?.data || response;
  },

  getQuickActions: async () => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockHRDashboardData.quickActions;
    }
    const response = await apiClient.get('/hr/dashboard/quick-actions');
    return response?.data || response;
  },

  getNotifications: async () => {
    if (USE_MOCK_DATA) {
      await delay(250);
      return mockHRDashboardData.notifications;
    }
    const response = await apiClient.get('/hr/dashboard/notifications');
    return response?.data || response;
  },
};
