import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockTemplates = [
  { id: 'wt-leave', name: 'Leave Approval Workflow', description: 'Standard 2-stage approval routing for leave requests.', type: 'LEAVE', totalSteps: 2, active: true },
  { id: 'wt-attn', name: 'Attendance Regularization', description: 'Single-stage manager approval for correction anomalies.', type: 'ATTENDANCE', totalSteps: 1, active: true },
  { id: 'wt-profile', name: 'Profile Update Verification', description: 'HR validation route for contact detail modification.', type: 'PROFILE', totalSteps: 1, active: true },
  { id: 'wt-onboard', name: 'Employee Onboarding', description: 'Multi-stage administrative tracking for new hires onboarding.', type: 'ONBOARDING', totalSteps: 3, active: true },
];

let mockApprovalRequests = [
  {
    id: 'req-001',
    requesterName: 'Aarav Patel',
    requesterId: 'emp-001',
    module: 'LEAVE',
    details: 'Casual Leave Request\nStart: 2026-07-30 • End: 2026-08-02\nReason: Family reunion',
    status: 'PENDING',
    createdAt: '2026-07-20T10:00:00Z',
    comments: [
      { id: 'c1', authorName: 'Aarav Patel', comment: 'Kindly approve, tickets are booked.', timestamp: '2026-07-20T10:00:00Z' },
    ],
    history: [
      { id: 'h1', action: 'SUBMITTED', performedBy: 'Aarav Patel', timestamp: '2026-07-20T10:00:00Z' },
    ],
    workflow: {
      id: 'wf-leave-1',
      name: 'Leave Approval',
      type: 'LEAVE_APPROVAL',
      status: 'PENDING',
      createdAt: '2026-07-20T10:00:00Z',
      steps: [
        {
          id: 'step-1',
          sequence: 1,
          name: 'Manager Approval',
          status: 'APPROVED',
          completedAt: '2026-07-21T09:30:00Z',
          completedBy: 'emp-mgr1',
          approvers: [{ id: 'emp-mgr1', firstName: 'Sanjay', lastName: 'Kumar', email: 'sanjay.kumar@company.com', role: 'MANAGER' }],
        },
        {
          id: 'step-2',
          sequence: 2,
          name: 'HR Verification',
          status: 'PENDING',
          approvers: [{ id: 'emp-mgr2', firstName: 'Kriti', lastName: 'Sen', email: 'kriti.sen@company.com', role: 'HR' }],
        },
      ],
    },
  },
  {
    id: 'req-002',
    requesterName: 'Priya Sharma',
    requesterId: 'emp-002',
    module: 'ATTENDANCE',
    details: 'Attendance Adjustment\nDate: 2026-07-15 • Missing punch corrected to: 09:00 AM - 06:00 PM',
    status: 'PENDING',
    createdAt: '2026-07-21T11:15:00Z',
    comments: [],
    history: [
      { id: 'h2', action: 'SUBMITTED', performedBy: 'Priya Sharma', timestamp: '2026-07-21T11:15:00Z' },
    ],
    workflow: {
      id: 'wf-attn-1',
      name: 'Attendance Regularization',
      type: 'ATTENDANCE_REGULARIZATION',
      status: 'PENDING',
      createdAt: '2026-07-21T11:15:00Z',
      steps: [
        {
          id: 'step-3',
          sequence: 1,
          name: 'Manager Review',
          status: 'PENDING',
          approvers: [{ id: 'emp-mgr1', firstName: 'Sanjay', lastName: 'Kumar', email: 'sanjay.kumar@company.com', role: 'MANAGER' }],
        },
      ],
    },
  },
  {
    id: 'req-003',
    requesterName: 'Vikram Singh',
    requesterId: 'emp-003',
    module: 'PROFILE',
    details: 'Profile Address Update Request\nUpdated emergency phone and primary residence street location.',
    status: 'APPROVED',
    createdAt: '2026-07-18T14:20:00Z',
    comments: [
      { id: 'c2', authorName: 'Kriti Sen', comment: 'Verified document attachments.', timestamp: '2026-07-19T10:00:00Z' },
    ],
    history: [
      { id: 'h3', action: 'SUBMITTED', performedBy: 'Vikram Singh', timestamp: '2026-07-18T14:20:00Z' },
      { id: 'h4', action: 'APPROVED', performedBy: 'Kriti Sen', timestamp: '2026-07-19T10:00:00Z', comment: 'Verified document attachments.' },
    ],
    workflow: {
      id: 'wf-prof-1',
      name: 'Profile Verification',
      type: 'DOCUMENT_APPROVAL',
      status: 'APPROVED',
      createdAt: '2026-07-18T14:20:00Z',
      steps: [
        {
          id: 'step-4',
          sequence: 1,
          name: 'HR Validation',
          status: 'APPROVED',
          completedAt: '2026-07-19T10:00:00Z',
          completedBy: 'emp-mgr2',
          approvers: [{ id: 'emp-mgr2', firstName: 'Kriti', lastName: 'Sen', email: 'kriti.sen@company.com', role: 'HR' }],
        },
      ],
    },
  },
];

export const workflowService = {
  getWorkflowTemplates: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockTemplates;
    }
    const response = await apiClient.get('/admin/workflows/templates');
    return response?.data || response;
  },

  getApprovalQueue: async ({ search, status } = {}) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      let filtered = [...mockApprovalRequests];

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (req) =>
            req.requesterName.toLowerCase().includes(query) ||
            req.module.toLowerCase().includes(query) ||
            req.details.toLowerCase().includes(query)
        );
      }

      if (status && status !== 'all') {
        filtered = filtered.filter((req) => req.status === status);
      }

      return filtered;
    }
    const response = await apiClient.get('/admin/workflows/queue', { params: { search, status } });
    return response?.data || response;
  },

  getWorkflowDetails: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const req = mockApprovalRequests.find((r) => r.id === id);
      if (!req) throw new Error('Workflow request not found.');
      return req;
    }
    const response = await apiClient.get(`/admin/workflows/requests/${id}`);
    return response?.data || response;
  },

  approveRequest: async (id, comment) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const index = mockApprovalRequests.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Request not found.');

      const req = mockApprovalRequests[index];
      const activeStep = req.workflow.steps.find((s) => s.status === 'PENDING');
      if (activeStep) {
        activeStep.status = 'APPROVED';
        activeStep.completedAt = new Date().toISOString();
        activeStep.completedBy = 'emp-mgr2'; // HR Admin
      }

      const allApproved = req.workflow.steps.every((s) => s.status === 'APPROVED');
      if (allApproved) {
        req.status = 'APPROVED';
        req.workflow.status = 'APPROVED';
      }

      if (comment) {
        req.comments.push({
          id: `comment-${Math.random().toString(36).substr(2, 9)}`,
          authorName: 'HR Administrator',
          comment,
          timestamp: new Date().toISOString(),
        });
      }

      req.history.push({
        id: `h-${Math.random().toString(36).substr(2, 9)}`,
        action: 'APPROVED',
        performedBy: 'HR Administrator',
        timestamp: new Date().toISOString(),
        comment,
      });

      return req;
    }
    const response = await apiClient.post(`/admin/workflows/requests/${id}/approve`, { comment });
    return response?.data || response;
  },

  rejectRequest: async (id, comment) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const index = mockApprovalRequests.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Request not found.');

      const req = mockApprovalRequests[index];
      const activeStep = req.workflow.steps.find((s) => s.status === 'PENDING');
      if (activeStep) {
        activeStep.status = 'REJECTED';
        activeStep.completedAt = new Date().toISOString();
        activeStep.completedBy = 'emp-mgr2';
      }

      req.status = 'REJECTED';
      req.workflow.status = 'REJECTED';

      if (comment) {
        req.comments.push({
          id: `comment-${Math.random().toString(36).substr(2, 9)}`,
          authorName: 'HR Administrator',
          comment,
          timestamp: new Date().toISOString(),
        });
      }

      req.history.push({
        id: `h-${Math.random().toString(36).substr(2, 9)}`,
        action: 'REJECTED',
        performedBy: 'HR Administrator',
        timestamp: new Date().toISOString(),
        comment,
      });

      return req;
    }
    const response = await apiClient.post(`/admin/workflows/requests/${id}/reject`, { comment });
    return response?.data || response;
  },

  returnRequest: async (id, comment) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const index = mockApprovalRequests.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Request not found.');

      const req = mockApprovalRequests[index];
      req.status = 'RETURNED';
      req.workflow.status = 'RETURNED';

      if (comment) {
        req.comments.push({
          id: `comment-${Math.random().toString(36).substr(2, 9)}`,
          authorName: 'HR Administrator',
          comment,
          timestamp: new Date().toISOString(),
        });
      }

      req.history.push({
        id: `h-${Math.random().toString(36).substr(2, 9)}`,
        action: 'RETURNED',
        performedBy: 'HR Administrator',
        timestamp: new Date().toISOString(),
        comment,
      });

      return req;
    }
    const response = await apiClient.post(`/admin/workflows/requests/${id}/return`, { comment });
    return response?.data || response;
  },
};
