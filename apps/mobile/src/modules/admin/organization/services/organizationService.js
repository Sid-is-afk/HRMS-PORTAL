import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockManagers = [];

let mockDepartments = [];

let mockDesignations = [];

let mockTeams = [];

let mockLocations = [];

const mockHierarchy = {
  id: 'root-org',
  label: 'Enterprise HRMS Inc.',
  subtitle: 'Corporate HQ',
  children: [],
};

export const organizationService = {
  getDepartments: async ({ search, status } = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let filtered = [...mockDepartments];
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter((d) => d.name.toLowerCase().includes(query) || d.code.toLowerCase().includes(query));
      }
      if (status && status !== 'all') {
        filtered = filtered.filter((d) => d.status === status);
      }
      return filtered;
    }
    const response = await apiClient.get('/admin/departments', { params: { search, status } });
    return response?.data || response;
  },

  getDepartment: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const dept = mockDepartments.find((d) => d.id === id);
      if (!dept) throw new Error('Department not found.');
      return dept;
    }
    const response = await apiClient.get(`/admin/departments/${id}`);
    return response?.data || response;
  },

  createDepartment: async (data) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const newDept = {
        id: `dept-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        code: data.code,
        description: data.description || '',
        managerId: data.managerId || null,
        parentDepartmentId: data.parentDepartmentId || null,
        status: 'ACTIVE',
      };
      mockDepartments.push(newDept);
      return newDept;
    }
    const response = await apiClient.post('/admin/departments', data);
    return response?.data || response;
  },

  updateDepartment: async (id, data) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const index = mockDepartments.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Department not found.');
      const updated = {
        ...mockDepartments[index],
        ...data,
      };
      mockDepartments[index] = updated;
      return updated;
    }
    const response = await apiClient.put(`/admin/departments/${id}`, data);
    return response?.data || response;
  },

  getDesignations: async ({ search, departmentId } = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let filtered = [...mockDesignations];
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter((d) => d.title.toLowerCase().includes(query));
      }
      if (departmentId && departmentId !== 'all') {
        filtered = filtered.filter((d) => d.departmentId === departmentId);
      }
      return filtered;
    }
    const response = await apiClient.get('/admin/designations', { params: { search, departmentId } });
    return response?.data || response;
  },

  getDesignation: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const desig = mockDesignations.find((d) => d.id === id);
      if (!desig) throw new Error('Designation not found.');
      return desig;
    }
    const response = await apiClient.get(`/admin/designations/${id}`);
    return response?.data || response;
  },

  createDesignation: async (data) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const newDesig = {
        id: `des-${Math.random().toString(36).substr(2, 9)}`,
        title: data.title,
        departmentId: data.departmentId,
        level: data.level,
        description: data.description || '',
        status: 'ACTIVE',
      };
      mockDesignations.push(newDesig);
      return newDesig;
    }
    const response = await apiClient.post('/admin/designations', data);
    return response?.data || response;
  },

  updateDesignation: async (id, data) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const index = mockDesignations.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Designation not found.');
      const updated = {
        ...mockDesignations[index],
        ...data,
      };
      mockDesignations[index] = updated;
      return updated;
    }
    const response = await apiClient.put(`/admin/designations/${id}`, data);
    return response?.data || response;
  },

  getTeams: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockTeams;
    }
    const response = await apiClient.get('/admin/teams');
    return response?.data || response;
  },

  getLocations: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockLocations;
    }
    const response = await apiClient.get('/admin/locations');
    return response?.data || response;
  },

  getOrganizationHierarchy: async () => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockHierarchy;
    }
    const response = await apiClient.get('/admin/hierarchy');
    return response?.data || response;
  },

  getManagers: async () => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockManagers;
    }
    const response = await apiClient.get('/admin/managers');
    return response?.data || response;
  },
};
