import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Data
const mockSummary = {
  openRequisitions: 6,
  publishedJobs: 4,
  pendingApprovals: 2,
  hiringManagersCount: 3,
  departmentsHiringCount: 2,
  upcomingActivitiesCount: 3,
  pendingTasksCount: 5,
};

let mockRequisitions = [
  {
    id: 'req-1',
    title: 'Senior Software Engineer (React Native)',
    departmentId: 'dept-eng',
    departmentName: 'Engineering',
    hiringManagerId: 'emp-mgr1',
    hiringManager: { id: 'emp-mgr1', firstName: 'Sanjay', lastName: 'Kumar', email: 'sanjay.kumar@company.com' },
    employmentType: 'FULL_TIME',
    locationId: 'loc-hq',
    locationName: 'Corporate HQ (Bengaluru)',
    priority: 'HIGH',
    openPositions: 2,
    requiredSkills: ['React Native', 'JavaScript', 'Redux', 'Mobile UX'],
    experienceMin: 5,
    experienceMax: 8,
    salaryMin: 1200000,
    salaryMax: 1800000,
    approvalStatus: 'APPROVED',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'req-2',
    title: 'HR Specialist',
    departmentId: 'dept-hr',
    departmentName: 'Human Resources',
    hiringManagerId: 'emp-mgr2',
    hiringManager: { id: 'emp-mgr2', firstName: 'Kriti', lastName: 'Sen', email: 'kriti.sen@company.com' },
    employmentType: 'FULL_TIME',
    locationId: 'loc-hq',
    locationName: 'Corporate HQ (Bengaluru)',
    priority: 'MEDIUM',
    openPositions: 1,
    requiredSkills: ['Talent Sourcing', 'Employee Relations', 'Onboarding'],
    experienceMin: 2,
    experienceMax: 4,
    salaryMin: 600000,
    salaryMax: 900000,
    approvalStatus: 'PENDING',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'req-3',
    title: 'Product Manager',
    departmentId: 'dept-prod',
    departmentName: 'Product',
    hiringManagerId: 'emp-mgr1',
    hiringManager: { id: 'emp-mgr1', firstName: 'Sanjay', lastName: 'Kumar', email: 'sanjay.kumar@company.com' },
    employmentType: 'FULL_TIME',
    locationId: 'loc-hybrid',
    locationName: 'Innovation Hub (London)',
    priority: 'HIGH',
    openPositions: 1,
    requiredSkills: ['Product Strategy', 'Roadmapping', 'Agile'],
    experienceMin: 4,
    experienceMax: 7,
    salaryMin: 1500000,
    salaryMax: 2200000,
    approvalStatus: 'PENDING',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

let mockPostings = [
  {
    id: 'post-1',
    requisitionId: 'req-1',
    title: 'Senior Software Engineer (React Native)',
    description: 'We are seeking a talented React Native engineer to spearhead development of our core mobile HR platform...',
    type: 'INTERNAL',
    status: 'PUBLISHED',
    expirationDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    visibility: 'PUBLIC',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'post-2',
    requisitionId: 'req-1',
    title: 'Senior React Native Developer',
    description: 'Looking for a Senior Developer to build offline-first applications and modular mobile solutions...',
    type: 'EXTERNAL',
    status: 'DRAFT',
    expirationDate: new Date(Date.now() + 45 * 86400000).toISOString(),
    visibility: 'PUBLIC',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

let mockActivities = [
  { id: 'act-r1', requisitionId: 'req-1', type: 'REQUISITION_APPROVED', description: 'Requisition approved: Senior RN Developer', timestamp: new Date(Date.now() - 3600000).toISOString(), performedBy: 'Sanjay Kumar' },
  { id: 'act-r2', requisitionId: 'req-1', type: 'JOB_PUBLISHED', description: 'Job posting published internally: Senior RN Developer', timestamp: new Date(Date.now() - 7200000).toISOString(), performedBy: 'Kriti Sen' },
  { id: 'act-r3', requisitionId: 'req-2', type: 'REQUISITION_CREATED', description: 'Requisition raised: HR Specialist', timestamp: new Date(Date.now() - 86400000).toISOString(), performedBy: 'Kriti Sen' },
];

export const talentService = {
  getTalentDashboard: async () => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return {
        ...mockSummary,
        openRequisitions: mockRequisitions.filter(r => r.status === 'ACTIVE').length,
        publishedJobs: mockPostings.filter(p => p.status === 'PUBLISHED').length,
        pendingApprovals: mockRequisitions.filter(r => r.approvalStatus === 'PENDING').length,
      };
    }
    const response = await apiClient.get('/hr/recruitment/dashboard');
    return response?.data || response;
  },

  getJobRequisitions: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let results = [...mockRequisitions];

      if (filters.departmentId && filters.departmentId !== 'all') {
        results = results.filter(r => r.departmentId === filters.departmentId);
      }
      if (filters.hiringManagerId && filters.hiringManagerId !== 'all') {
        results = results.filter(r => r.hiringManagerId === filters.hiringManagerId);
      }
      if (filters.employmentType && filters.employmentType !== 'all') {
        results = results.filter(r => r.employmentType === filters.employmentType);
      }
      if (filters.priority && filters.priority !== 'all') {
        results = results.filter(r => r.priority === filters.priority);
      }
      if (filters.status && filters.status !== 'all') {
        results = results.filter(r => r.status === filters.status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        results = results.filter(r => r.title.toLowerCase().includes(query) || r.departmentName.toLowerCase().includes(query));
      }

      return results;
    }
    const response = await apiClient.get('/hr/recruitment/requisitions', { params: filters });
    return response?.data || response;
  },

  createJobRequisition: async (data) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      const newReq = {
        id: `req-${Math.random().toString(36).substr(2, 9)}`,
        title: data.title,
        departmentId: data.departmentId,
        departmentName: data.departmentId === 'dept-eng' ? 'Engineering' : 'Human Resources',
        hiringManagerId: data.hiringManagerId,
        hiringManager: { id: data.hiringManagerId, firstName: 'Hiring', lastName: 'Manager', email: 'manager@company.com' },
        employmentType: data.employmentType,
        locationId: data.locationId,
        locationName: data.locationId === 'loc-hq' ? 'Corporate HQ (Bengaluru)' : 'Innovation Hub (London)',
        priority: data.priority,
        openPositions: data.openPositions,
        requiredSkills: data.requiredSkills,
        experienceMin: data.experienceMin,
        experienceMax: data.experienceMax,
        salaryMin: data.salaryMin || 0,
        salaryMax: data.salaryMax || 0,
        approvalStatus: 'PENDING',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      mockRequisitions.unshift(newReq);

      // Add hiring activity log
      mockActivities.unshift({
        id: `act-${Math.random().toString(36).substr(2, 9)}`,
        requisitionId: newReq.id,
        type: 'REQUISITION_CREATED',
        description: `Requisition raised: ${newReq.title}`,
        timestamp: new Date().toISOString(),
        performedBy: 'HR Agent',
      });

      return newReq;
    }
    const response = await apiClient.post('/hr/recruitment/requisitions', data);
    return response?.data || response;
  },

  updateJobRequisition: async (id, data) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const idx = mockRequisitions.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('Job Requisition not found');
      const updated = {
        ...mockRequisitions[idx],
        ...data,
      };
      mockRequisitions[idx] = updated;
      return updated;
    }
    const response = await apiClient.put(`/hr/recruitment/requisitions/${id}`, data);
    return response?.data || response;
  },

  getJobPostings: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let results = [...mockPostings];

      if (filters.status && filters.status !== 'all') {
        results = results.filter(p => p.status === filters.status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        results = results.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
      }

      return results;
    }
    const response = await apiClient.get('/hr/recruitment/postings', { params: filters });
    return response?.data || response;
  },

  publishJobPosting: async (requisitionId, data) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      const req = mockRequisitions.find(r => r.id === requisitionId);
      if (!req) throw new Error('Associated Requisition not found');
      
      const newPost = {
        id: `post-${Math.random().toString(36).substr(2, 9)}`,
        requisitionId,
        title: req.title,
        description: data.description,
        type: data.type || 'INTERNAL',
        status: 'PUBLISHED',
        expirationDate: data.expirationDate || new Date(Date.now() + 30 * 86400000).toISOString(),
        visibility: data.visibility || 'PUBLIC',
        createdAt: new Date().toISOString(),
      };
      mockPostings.unshift(newPost);

      mockActivities.unshift({
        id: `act-${Math.random().toString(36).substr(2, 9)}`,
        requisitionId,
        type: 'JOB_PUBLISHED',
        description: `Job posting published: ${newPost.title}`,
        timestamp: new Date().toISOString(),
        performedBy: 'HR Agent',
      });

      return newPost;
    }
    const response = await apiClient.post(`/hr/recruitment/requisitions/${requisitionId}/publish`, data);
    return response?.data || response;
  },

  archiveJobPosting: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const idx = mockPostings.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Job posting not found');
      mockPostings[idx].status = 'ARCHIVED';

      mockActivities.unshift({
        id: `act-${Math.random().toString(36).substr(2, 9)}`,
        requisitionId: mockPostings[idx].requisitionId,
        type: 'JOB_CLOSED',
        description: `Job posting archived: ${mockPostings[idx].title}`,
        timestamp: new Date().toISOString(),
        performedBy: 'HR Agent',
      });

      return mockPostings[idx];
    }
    const response = await apiClient.post(`/hr/recruitment/postings/${id}/archive`);
    return response?.data || response;
  },

  getHiringActivities: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockActivities;
    }
    const response = await apiClient.get('/hr/recruitment/activities');
    return response?.data || response;
  },
};
