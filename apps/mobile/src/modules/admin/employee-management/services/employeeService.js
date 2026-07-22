import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockDepartments = [
  { id: 'dept-eng', name: 'Engineering', code: 'ENG' },
  { id: 'dept-hr', name: 'Human Resources', code: 'HR' },
  { id: 'dept-prod', name: 'Product', code: 'PROD' },
  { id: 'dept-mktg', name: 'Marketing', code: 'MKTG' },
];

const mockDesignations = [
  { id: 'des-se', title: 'Software Engineer', departmentId: 'dept-eng' },
  { id: 'des-sse', title: 'Senior Software Engineer', departmentId: 'dept-eng' },
  { id: 'des-hrm', title: 'HR Specialist', departmentId: 'dept-hr' },
  { id: 'des-pm', title: 'Product Manager', departmentId: 'dept-prod' },
  { id: 'des-ms', title: 'Marketing Associate', departmentId: 'dept-mktg' },
];

const mockManagers = [
  { id: 'emp-mgr1', firstName: 'Sanjay', lastName: 'Kumar', email: 'sanjay.kumar@company.com' },
  { id: 'emp-mgr2', firstName: 'Kriti', lastName: 'Sen', email: 'kriti.sen@company.com' },
];

let mockEmployees = [
  {
    id: 'emp-001',
    firstName: 'Aarav',
    lastName: 'Patel',
    email: 'aarav.patel@company.com',
    phone: '+919876543210',
    status: 'ACTIVE',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    emergencyContact: { name: 'Ramesh Patel', relationship: 'Father', phone: '+919876543211' },
    employment: {
      employeeId: 'EMP00001',
      type: 'FULL_TIME',
      joiningDate: '2022-03-15',
      role: 'EMPLOYEE',
      department: mockDepartments[0],
      designation: mockDesignations[1],
      manager: mockManagers[0],
    },
  },
  {
    id: 'emp-002',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@company.com',
    phone: '+919876543220',
    status: 'ACTIVE',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    emergencyContact: { name: 'Devendra Sharma', relationship: 'Spouse', phone: '+919876543221' },
    employment: {
      employeeId: 'EMP00002',
      type: 'FULL_TIME',
      joiningDate: '2023-05-10',
      role: 'HR',
      department: mockDepartments[1],
      designation: mockDesignations[2],
      manager: mockManagers[1],
    },
  },
  {
    id: 'emp-003',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@company.com',
    phone: '+919876543230',
    status: 'ACTIVE',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    emergencyContact: { name: 'Anjali Singh', relationship: 'Mother', phone: '+919876543231' },
    employment: {
      employeeId: 'EMP00003',
      type: 'FULL_TIME',
      joiningDate: '2024-01-20',
      role: 'EMPLOYEE',
      department: mockDepartments[2],
      designation: mockDesignations[3],
      manager: mockManagers[0],
    },
  },
  {
    id: 'emp-004',
    firstName: 'Rohan',
    lastName: 'Das',
    email: 'rohan.das@company.com',
    phone: '+919876543240',
    status: 'INACTIVE',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
    emergencyContact: { name: 'Mithun Das', relationship: 'Brother', phone: '+919876543241' },
    employment: {
      employeeId: 'EMP00004',
      type: 'CONTRACT',
      joiningDate: '2024-06-01',
      role: 'EMPLOYEE',
      department: mockDepartments[0],
      designation: mockDesignations[0],
      manager: mockManagers[0],
    },
  },
];

export const employeeService = {
  getEmployees: async ({ search, departmentId, designationId, status, type, role, page = 1, limit = 10 }) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      let filtered = [...mockEmployees];

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (emp) =>
            emp.firstName.toLowerCase().includes(query) ||
            emp.lastName.toLowerCase().includes(query) ||
            emp.email.toLowerCase().includes(query) ||
            emp.employment.employeeId.toLowerCase().includes(query)
        );
      }

      if (departmentId && departmentId !== 'all') {
        filtered = filtered.filter((emp) => emp.employment.department.id === departmentId);
      }

      if (designationId && designationId !== 'all') {
        filtered = filtered.filter((emp) => emp.employment.designation.id === designationId);
      }

      if (status && status !== 'all') {
        filtered = filtered.filter((emp) => emp.status === status);
      }

      if (type && type !== 'all') {
        filtered = filtered.filter((emp) => emp.employment.type === type);
      }

      if (role && role !== 'all') {
        filtered = filtered.filter((emp) => emp.employment.role === role);
      }

      const total = filtered.length;
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      return {
        data: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
    const response = await apiClient.get('/admin/employees', {
      params: { search, departmentId, designationId, status, type, role, page, limit },
    });
    return response?.data || response;
  },

  getEmployee: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const emp = mockEmployees.find((e) => e.id === id);
      if (!emp) throw new Error('Employee not found');
      return emp;
    }
    const response = await apiClient.get(`/admin/employees/${id}`);
    return response?.data || response;
  },

  createEmployee: async (data) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const department = mockDepartments.find((d) => d.id === data.departmentId);
      const designation = mockDesignations.find((d) => d.id === data.designationId);
      const manager = mockManagers.find((m) => m.id === data.managerId) || null;

      const newEmp = {
        id: `emp-${Math.random().toString(36).substr(2, 9)}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        status: 'ACTIVE',
        emergencyContact: data.emergencyContact,
        employment: {
          employeeId: data.employeeId,
          type: data.type,
          joiningDate: data.joiningDate,
          role: data.role,
          department,
          designation,
          manager,
        },
      };

      mockEmployees.push(newEmp);
      return newEmp;
    }
    const response = await apiClient.post('/admin/employees', data);
    return response?.data || response;
  },

  updateEmployee: async (id, data) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockEmployees.findIndex((e) => e.id === id);
      if (index === -1) throw new Error('Employee not found');

      const department = mockDepartments.find((d) => d.id === data.departmentId);
      const designation = mockDesignations.find((d) => d.id === data.designationId);
      const manager = mockManagers.find((m) => m.id === data.managerId) || null;

      const updated = {
        ...mockEmployees[index],
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        status: data.status || mockEmployees[index].status,
        emergencyContact: data.emergencyContact,
        employment: {
          ...mockEmployees[index].employment,
          employeeId: data.employeeId,
          type: data.type,
          joiningDate: data.joiningDate,
          role: data.role,
          department,
          designation,
          manager,
        },
      };

      mockEmployees[index] = updated;
      return updated;
    }
    const response = await apiClient.put(`/admin/employees/${id}`, data);
    return response?.data || response;
  },

  deactivateEmployee: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const index = mockEmployees.findIndex((e) => e.id === id);
      if (index === -1) throw new Error('Employee not found');
      mockEmployees[index].status = 'INACTIVE';
      return mockEmployees[index];
    }
    const response = await apiClient.post(`/admin/employees/${id}/deactivate`);
    return response?.data || response;
  },

  activateEmployee: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const index = mockEmployees.findIndex((e) => e.id === id);
      if (index === -1) throw new Error('Employee not found');
      mockEmployees[index].status = 'ACTIVE';
      return mockEmployees[index];
    }
    const response = await apiClient.post(`/admin/employees/${id}/activate`);
    return response?.data || response;
  },

  getDepartments: async () => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockDepartments;
    }
    const response = await apiClient.get('/admin/departments');
    return response?.data || response;
  },

  getDesignations: async () => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockDesignations;
    }
    const response = await apiClient.get('/admin/designations');
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
