import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Pre-populated Mock Data
let mockPermissions = [
  // Employee permissions
  { code: 'VIEW_EMPLOYEE', name: 'View Employees', description: 'Allows viewing employee directories, details, and profiles.', category: 'Employee Management' },
  { code: 'CREATE_EMPLOYEE', name: 'Create Employee', description: 'Allows adding new employee records to the system.', category: 'Employee Management' },
  { code: 'UPDATE_EMPLOYEE', name: 'Update Employee', description: 'Allows editing employee details and profiles.', category: 'Employee Management' },
  { code: 'DELETE_EMPLOYEE', name: 'Delete Employee', description: 'Allows soft deleting employee records.', category: 'Employee Management' },
  // Attendance permissions
  { code: 'VIEW_ATTENDANCE', name: 'View Attendance', description: 'Allows viewing personal or department attendance logs.', category: 'Attendance' },
  { code: 'MANAGE_ATTENDANCE', name: 'Manage Attendance', description: 'Allows correcting attendance logs and manual clocking.', category: 'Attendance' },
  // Leave permissions
  { code: 'VIEW_LEAVE', name: 'View Leaves', description: 'Allows viewing leave balances and request histories.', category: 'Leave Management' },
  { code: 'APPROVE_LEAVE', name: 'Approve Leaves', description: 'Allows approving or rejecting pending leave requests.', category: 'Leave Management' },
  // Administrative permissions
  { code: 'VIEW_REPORTS', name: 'View Reports', description: 'Allows accessing audit reports and attendance statistics.', category: 'Reports & Audits' },
  { code: 'MANAGE_DEPARTMENTS', name: 'Manage Departments', description: 'Allows creating and structuring branches and departments.', category: 'Organization' },
  { code: 'MANAGE_SHIFTS', name: 'Manage Shifts', description: 'Allows configuring weekly schedules and shifts.', category: 'Workforce Config' },
  { code: 'MANAGE_SETTINGS', name: 'Manage Settings', description: 'Allows modifying company configurations and rules.', category: 'System' },
  { code: 'MANAGE_SYSTEM', name: 'Manage System', description: 'Allows viewing system logs, backups, and health dashboards.', category: 'System' },
  // IAM specific permissions
  { code: 'VIEW_ROLE', name: 'View Roles', description: 'Allows viewing roles list, descriptions, and permission mappings.', category: 'Identity & Access' },
  { code: 'CREATE_ROLE', name: 'Create Roles', description: 'Allows creating custom tenant roles.', category: 'Identity & Access' },
  { code: 'UPDATE_ROLE', name: 'Update Roles', description: 'Allows editing role scopes and permissions.', category: 'Identity & Access' },
  { code: 'VIEW_PERMISSION', name: 'View Permissions', description: 'Allows reading permission categories and matrices.', category: 'Identity & Access' },
  { code: 'MANAGE_PERMISSION', name: 'Manage Permissions', description: 'Allows assigning, editing, or changing default permission definitions.', category: 'Identity & Access' },
  { code: 'ASSIGN_ROLE', name: 'Assign Roles', description: 'Allows assigning roles to employees or transferring role ownerships.', category: 'Identity & Access' },
  { code: 'VIEW_ACCESS_POLICY', name: 'View Access Policies', description: 'Allows reading conditional access policies.', category: 'Identity & Access' },
  { code: 'MANAGE_ACCESS_POLICY', name: 'Manage Access Policies', description: 'Allows creating, toggling, or editing conditional access policies.', category: 'Identity & Access' },
];

let mockRoles = [
  {
    id: 'role-super-admin',
    name: 'Super Administrator',
    code: 'ROLE_SUPER_ADMIN',
    description: 'System owner. Full access to database, tenants, system logs, security keys, and global configurations.',
    status: 'ACTIVE',
    isCustom: false,
    parentRoleId: null,
    permissions: mockPermissions.map(p => p.code),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-admin',
    name: 'Administrator',
    code: 'ROLE_ADMIN',
    description: 'General administrative operations. Manages workflow setups, organization hierarchies, workforce, and IAM.',
    status: 'ACTIVE',
    isCustom: false,
    parentRoleId: 'role-super-admin',
    permissions: [
      'VIEW_EMPLOYEE', 'VIEW_ATTENDANCE', 'MANAGE_ATTENDANCE', 'VIEW_LEAVE', 'APPROVE_LEAVE',
      'VIEW_REPORTS', 'MANAGE_DEPARTMENTS', 'MANAGE_SHIFTS', 'MANAGE_SETTINGS',
      'VIEW_ROLE', 'CREATE_ROLE', 'UPDATE_ROLE', 'VIEW_PERMISSION', 'MANAGE_PERMISSION',
      'ASSIGN_ROLE', 'VIEW_ACCESS_POLICY', 'MANAGE_ACCESS_POLICY'
    ],
    createdAt: '2026-01-02T00:00:00Z',
    updatedAt: '2026-07-15T12:30:00Z',
  },
  {
    id: 'role-hr',
    name: 'HR Specialist',
    code: 'ROLE_HR',
    description: 'Recruitment, employee onboarding, record keeping, leave reviews, and basic organizational details.',
    status: 'ACTIVE',
    isCustom: false,
    parentRoleId: 'role-admin',
    permissions: [
      'VIEW_EMPLOYEE', 'CREATE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'VIEW_ATTENDANCE',
      'MANAGE_ATTENDANCE', 'VIEW_LEAVE', 'APPROVE_LEAVE', 'VIEW_REPORTS',
      'MANAGE_DEPARTMENTS', 'MANAGE_SHIFTS'
    ],
    createdAt: '2026-01-03T00:00:00Z',
    updatedAt: '2026-05-10T10:15:00Z',
  },
  {
    id: 'role-employee',
    name: 'Standard Employee',
    code: 'ROLE_EMPLOYEE',
    description: 'Default role. Allows recording attendance, checking histories, applying for leave, and changing profile contact fields.',
    status: 'ACTIVE',
    isCustom: false,
    parentRoleId: 'role-hr',
    permissions: ['VIEW_EMPLOYEE', 'VIEW_ATTENDANCE', 'VIEW_LEAVE'],
    createdAt: '2026-01-04T00:00:00Z',
    updatedAt: '2026-01-04T00:00:00Z',
  },
  {
    id: 'role-finance',
    name: 'Finance & Payroll Officer',
    code: 'ROLE_FINANCE',
    description: 'Manages salary accounts, claims audits, reimbursement flows, and tax filings. Reuses employee portal.',
    status: 'ACTIVE',
    isCustom: true,
    parentRoleId: 'role-employee',
    permissions: ['VIEW_EMPLOYEE', 'VIEW_REPORTS', 'VIEW_ATTENDANCE', 'VIEW_LEAVE'],
    createdAt: '2026-06-20T14:00:00Z',
    updatedAt: '2026-06-25T09:45:00Z',
  }
];

let mockAssignments = [
  { id: 'asgn-1', employeeId: 'emp-1', employeeName: 'Sanjay Kumar', employeeEmail: 'sanjay.kumar@company.com', roleId: 'role-admin', roleName: 'Administrator', assignedAt: '2026-01-02T10:00:00Z', assignedBy: 'Super Admin' },
  { id: 'asgn-2', employeeId: 'emp-2', employeeName: 'Kriti Sen', employeeEmail: 'kriti.sen@company.com', roleId: 'role-hr', roleName: 'HR Specialist', assignedAt: '2026-01-03T11:00:00Z', assignedBy: 'Sanjay Kumar' },
  { id: 'asgn-3', employeeId: 'emp-3', employeeName: 'Aarav Patel', employeeEmail: 'aarav.patel@company.com', roleId: 'role-employee', roleName: 'Standard Employee', assignedAt: '2026-01-05T09:00:00Z', assignedBy: 'Kriti Sen' },
  { id: 'asgn-4', employeeId: 'emp-4', employeeName: 'Priya Sharma', employeeEmail: 'priya.sharma@company.com', roleId: 'role-employee', roleName: 'Standard Employee', assignedAt: '2026-01-06T09:00:00Z', assignedBy: 'Kriti Sen' },
  { id: 'asgn-5', employeeId: 'emp-5', employeeName: 'Vikram Singh', employeeEmail: 'vikram.singh@company.com', roleId: 'role-finance', roleName: 'Finance & Payroll Officer', assignedAt: '2026-06-21T15:00:00Z', assignedBy: 'Sanjay Kumar' }
];

let mockAccessPolicies = [
  { id: 'pol-1', name: 'Office Network Bound Access', description: 'Restrict sensitive administrative functions to corporate office IP addresses.', priority: 10, conditions: { ipRange: '192.168.1.0/24', mfaRequired: false }, status: 'ACTIVE' },
  { id: 'pol-2', name: 'Working Hour Access Constraint', description: 'Prevent standard employees from clocking in or requesting leaves outside business hours.', priority: 20, conditions: { timeWindowStart: '06:00', timeWindowEnd: '22:00', mfaRequired: false }, status: 'ACTIVE' },
  { id: 'pol-3', name: 'MFA Enforcement for IAM Screens', description: 'Force multi-factor authentication check for viewing and editing roles or access matrix.', priority: 1, conditions: { mfaRequired: true }, status: 'ACTIVE' }
];

let mockAccessReviews = [
  { id: 'rev-1', employeeName: 'Sanjay Kumar', roleName: 'Administrator', status: 'APPROVED', lastReviewedAt: '2026-07-01T09:00:00Z', reviewedBy: 'Super Admin' },
  { id: 'rev-2', employeeName: 'Kriti Sen', roleName: 'HR Specialist', status: 'PENDING_REVIEW', lastReviewedAt: null, reviewedBy: null },
  { id: 'rev-3', employeeName: 'Vikram Singh', roleName: 'Finance & Payroll Officer', status: 'PENDING_REVIEW', lastReviewedAt: null, reviewedBy: null }
];

export const iamService = {
  // Roles Management API
  getRoles: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return [...mockRoles];
    }
    const response = await apiClient.get('/admin/iam/roles');
    return response?.data || response;
  },

  getRole: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const role = mockRoles.find(r => r.id === id);
      if (!role) throw new Error('Role not found.');
      return { ...role };
    }
    const response = await apiClient.get(`/admin/iam/roles/${id}`);
    return response?.data || response;
  },

  createRole: async (roleData) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newRole = {
        id: `role-${Math.random().toString(36).substr(2, 9)}`,
        ...roleData,
        isCustom: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockRoles.push(newRole);
      return newRole;
    }
    const response = await apiClient.post('/admin/iam/roles', roleData);
    return response?.data || response;
  },

  updateRole: async (id, roleData) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const idx = mockRoles.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('Role not found.');
      mockRoles[idx] = {
        ...mockRoles[idx],
        ...roleData,
        updatedAt: new Date().toISOString(),
      };
      return mockRoles[idx];
    }
    const response = await apiClient.put(`/admin/iam/roles/${id}`, roleData);
    return response?.data || response;
  },

  archiveRole: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const idx = mockRoles.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('Role not found.');
      mockRoles[idx] = {
        ...mockRoles[idx],
        status: 'ARCHIVED',
        updatedAt: new Date().toISOString(),
      };
      return mockRoles[idx];
    }
    const response = await apiClient.post(`/admin/iam/roles/${id}/archive`);
    return response?.data || response;
  },

  cloneRole: async (id, name, code) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const original = mockRoles.find(r => r.id === id);
      if (!original) throw new Error('Original role not found.');
      
      const cloned = {
        ...original,
        id: `role-${Math.random().toString(36).substr(2, 9)}`,
        name,
        code,
        isCustom: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockRoles.push(cloned);
      return cloned;
    }
    const response = await apiClient.post(`/admin/iam/roles/${id}/clone`, { name, code });
    return response?.data || response;
  },

  // Permissions API
  getPermissions: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return [...mockPermissions];
    }
    const response = await apiClient.get('/admin/iam/permissions');
    return response?.data || response;
  },

  getPermissionGroups: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const groupsMap = mockPermissions.reduce((acc, p) => {
        if (!acc[p.category]) {
          acc[p.category] = {
            id: p.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name: p.category,
            description: `Manage system capabilities related to ${p.category}.`,
            permissions: [],
          };
        }
        acc[p.category].permissions.push(p);
        return acc;
      }, {});
      return Object.values(groupsMap);
    }
    const response = await apiClient.get('/admin/iam/permission-groups');
    return response?.data || response;
  },

  // Role Assignments API
  getRoleAssignments: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return [...mockAssignments];
    }
    const response = await apiClient.get('/admin/iam/assignments');
    return response?.data || response;
  },

  assignRole: async (employeeId, roleId) => {
    if (USE_MOCK_DATA) {
      await delay(450);
      const role = mockRoles.find(r => r.id === roleId);
      if (!role) throw new Error('Role does not exist.');
      
      // Look up employee placeholder name
      const names = { 'emp-1': 'Sanjay Kumar', 'emp-2': 'Kriti Sen', 'emp-3': 'Aarav Patel', 'emp-4': 'Priya Sharma', 'emp-5': 'Vikram Singh' };
      const name = names[employeeId] || `Employee ${employeeId.substring(4)}`;
      
      const newAsgn = {
        id: `asgn-${Math.random().toString(36).substr(2, 9)}`,
        employeeId,
        employeeName: name,
        employeeEmail: `${name.toLowerCase().replace(' ', '.')}@company.com`,
        roleId,
        roleName: role.name,
        assignedAt: new Date().toISOString(),
        assignedBy: 'Administrator',
      };
      
      mockAssignments.push(newAsgn);
      return newAsgn;
    }
    const response = await apiClient.post('/admin/iam/assignments', { employeeId, roleId });
    return response?.data || response;
  },

  removeRole: async (assignmentId) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const idx = mockAssignments.findIndex(a => a.id === assignmentId);
      if (idx === -1) throw new Error('Role assignment not found.');
      const removed = mockAssignments[idx];
      mockAssignments.splice(idx, 1);
      return removed;
    }
    const response = await apiClient.delete(`/admin/iam/assignments/${assignmentId}`);
    return response?.data || response;
  },

  transferRole: async (employeeId, oldRoleId, newRoleId) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const idx = mockAssignments.findIndex(a => a.employeeId === employeeId && a.roleId === oldRoleId);
      if (idx !== -1) {
        mockAssignments.splice(idx, 1);
      }
      return await iamService.assignRole(employeeId, newRoleId);
    }
    const response = await apiClient.post('/admin/iam/assignments/transfer', { employeeId, oldRoleId, newRoleId });
    return response?.data || response;
  },

  // Access Policies API
  getAccessPolicies: async () => {
    if (USE_MOCK_DATA) {
      await delay(350);
      return [...mockAccessPolicies];
    }
    const response = await apiClient.get('/admin/iam/policies');
    return response?.data || response;
  },

  createAccessPolicy: async (policyData) => {
    if (USE_MOCK_DATA) {
      await delay(450);
      const newPolicy = {
        id: `pol-${Math.random().toString(36).substr(2, 9)}`,
        ...policyData,
      };
      mockAccessPolicies.push(newPolicy);
      return newPolicy;
    }
    const response = await apiClient.post('/admin/iam/policies', policyData);
    return response?.data || response;
  },

  updateAccessPolicy: async (id, policyData) => {
    if (USE_MOCK_DATA) {
      await delay(450);
      const idx = mockAccessPolicies.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Access policy not found.');
      mockAccessPolicies[idx] = {
        ...mockAccessPolicies[idx],
        ...policyData,
      };
      return mockAccessPolicies[idx];
    }
    const response = await apiClient.put(`/admin/iam/policies/${id}`, policyData);
    return response?.data || response;
  },

  // User Effective Permissions Preview
  getEffectivePermissions: async (employeeId) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      // Find assigned roles
      const userAssignments = mockAssignments.filter(a => a.employeeId === employeeId);
      const roles = userAssignments.map(a => mockRoles.find(r => r.id === a.roleId)).filter(Boolean);
      
      const permissionsMap = {};
      roles.forEach(role => {
        role.permissions.forEach(permCode => {
          if (!permissionsMap[permCode]) {
            const def = mockPermissions.find(p => p.code === permCode);
            permissionsMap[permCode] = {
              code: permCode,
              name: def ? def.name : permCode,
              description: def ? def.description : 'Custom scoped permission.',
              granted: true,
              sources: [],
            };
          }
          permissionsMap[permCode].sources.push(role.name);
        });
      });

      // Fill in remaining permissions as not granted
      mockPermissions.forEach(perm => {
        if (!permissionsMap[perm.code]) {
          permissionsMap[perm.code] = {
            code: perm.code,
            name: perm.name,
            description: perm.description,
            granted: false,
            sources: [],
          };
        }
      });

      return Object.values(permissionsMap);
    }
    const response = await apiClient.get(`/admin/iam/employees/${employeeId}/effective-permissions`);
    return response?.data || response;
  },

  // Access Reviews API
  getAccessReviews: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return [...mockAccessReviews];
    }
    const response = await apiClient.get('/admin/iam/reviews');
    return response?.data || response;
  },

  verifyAccessReview: async (reviewId) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const review = mockAccessReviews.find(r => r.id === reviewId);
      if (!review) throw new Error('Review entry not found.');
      review.status = 'APPROVED';
      review.lastReviewedAt = new Date().toISOString();
      review.reviewedBy = 'Administrator';
      return { ...review };
    }
    const response = await apiClient.post(`/admin/iam/reviews/${reviewId}/verify`);
    return response?.data || response;
  }
};
