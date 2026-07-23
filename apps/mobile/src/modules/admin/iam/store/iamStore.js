import { create } from 'zustand';
import { iamService } from '../services/iamService';

export const useIamStore = create((set, get) => ({
  roles: [],
  permissions: [],
  permissionGroups: [],
  assignments: [],
  accessPolicies: [],
  accessReviews: [],
  effectivePermissions: [],

  isLoading: false,
  isRefreshing: false,
  error: null,

  selectedRoleId: null,
  selectedEmployeeId: null,
  
  filters: {
    roleSearch: '',
    roleStatus: 'all', // 'all' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    assignmentSearch: '',
    policySearch: '',
  },

  // Actions
  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
  },

  resetFilters: () => {
    set({
      filters: {
        roleSearch: '',
        roleStatus: 'all',
        assignmentSearch: '',
        policySearch: '',
      }
    });
  },

  setSelectedRoleId: (id) => set({ selectedRoleId: id }),
  setSelectedEmployeeId: (id) => {
    set({ selectedEmployeeId: id });
    if (id) {
      get().loadEffectivePermissions(id);
    } else {
      set({ effectivePermissions: [] });
    }
  },

  loadRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await iamService.getRoles();
      set({ roles: data, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load roles', isLoading: false });
    }
  },

  loadPermissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const [perms, groups] = await Promise.all([
        iamService.getPermissions(),
        iamService.getPermissionGroups(),
      ]);
      set({ permissions: perms, permissionGroups: groups, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load permissions', isLoading: false });
    }
  },

  loadAssignments: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await iamService.getRoleAssignments();
      set({ assignments: data, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load role assignments', isLoading: false });
    }
  },

  loadAccessPolicies: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await iamService.getAccessPolicies();
      set({ accessPolicies: data, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load access policies', isLoading: false });
    }
  },

  loadAccessReviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await iamService.getAccessReviews();
      set({ accessReviews: data, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load access reviews', isLoading: false });
    }
  },

  loadEffectivePermissions: async (employeeId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await iamService.getEffectivePermissions(employeeId);
      set({ effectivePermissions: data, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load effective permissions', isLoading: false });
    }
  },

  refreshAll: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const [roles, perms, groups, asgns, policies, reviews] = await Promise.all([
        iamService.getRoles(),
        iamService.getPermissions(),
        iamService.getPermissionGroups(),
        iamService.getRoleAssignments(),
        iamService.getAccessPolicies(),
        iamService.getAccessReviews(),
      ]);
      set({
        roles,
        permissions: perms,
        permissionGroups: groups,
        assignments: asgns,
        accessPolicies: policies,
        accessReviews: reviews,
        isRefreshing: false
      });
      
      const { selectedEmployeeId } = get();
      if (selectedEmployeeId) {
        await get().loadEffectivePermissions(selectedEmployeeId);
      }
    } catch (err) {
      set({ error: err.message || 'Failed to refresh IAM data', isRefreshing: false });
    }
  },

  createRole: async (roleData) => {
    set({ isLoading: true, error: null });
    try {
      const newRole = await iamService.createRole(roleData);
      set((state) => ({ roles: [...state.roles, newRole], isLoading: false }));
      return newRole;
    } catch (err) {
      set({ error: err.message || 'Failed to create role', isLoading: false });
      throw err;
    }
  },

  updateRole: async (id, roleData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedRole = await iamService.updateRole(id, roleData);
      set((state) => ({
        roles: state.roles.map(r => r.id === id ? updatedRole : r),
        isLoading: false
      }));
      return updatedRole;
    } catch (err) {
      set({ error: err.message || 'Failed to update role', isLoading: false });
      throw err;
    }
  },

  archiveRole: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const archived = await iamService.archiveRole(id);
      set((state) => ({
        roles: state.roles.map(r => r.id === id ? archived : r),
        isLoading: false
      }));
      return archived;
    } catch (err) {
      set({ error: err.message || 'Failed to archive role', isLoading: false });
      throw err;
    }
  },

  cloneRole: async (id, name, code) => {
    set({ isLoading: true, error: null });
    try {
      const cloned = await iamService.cloneRole(id, name, code);
      set((state) => ({ roles: [...state.roles, cloned], isLoading: false }));
      return cloned;
    } catch (err) {
      set({ error: err.message || 'Failed to clone role', isLoading: false });
      throw err;
    }
  },

  assignRole: async (employeeId, roleId) => {
    set({ isLoading: true, error: null });
    try {
      const newAsgn = await iamService.assignRole(employeeId, roleId);
      set((state) => ({ assignments: [...state.assignments, newAsgn], isLoading: false }));
      return newAsgn;
    } catch (err) {
      set({ error: err.message || 'Failed to assign role', isLoading: false });
      throw err;
    }
  },

  removeRole: async (assignmentId) => {
    set({ isLoading: true, error: null });
    try {
      await iamService.removeRole(assignmentId);
      set((state) => ({
        assignments: state.assignments.filter(a => a.id !== assignmentId),
        isLoading: false
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to remove role assignment', isLoading: false });
      throw err;
    }
  },

  transferRole: async (employeeId, oldRoleId, newRoleId) => {
    set({ isLoading: true, error: null });
    try {
      const newAsgn = await iamService.transferRole(employeeId, oldRoleId, newRoleId);
      set((state) => ({
        assignments: state.assignments
          .filter(a => !(a.employeeId === employeeId && a.roleId === oldRoleId))
          .concat(newAsgn),
        isLoading: false
      }));
      return newAsgn;
    } catch (err) {
      set({ error: err.message || 'Failed to transfer role', isLoading: false });
      throw err;
    }
  },

  createAccessPolicy: async (policyData) => {
    set({ isLoading: true, error: null });
    try {
      const newPolicy = await iamService.createAccessPolicy(policyData);
      set((state) => ({ accessPolicies: [...state.accessPolicies, newPolicy], isLoading: false }));
      return newPolicy;
    } catch (err) {
      set({ error: err.message || 'Failed to create access policy', isLoading: false });
      throw err;
    }
  },

  updateAccessPolicy: async (id, policyData) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await iamService.updateAccessPolicy(id, policyData);
      set((state) => ({
        accessPolicies: state.accessPolicies.map(p => p.id === id ? updated : p),
        isLoading: false
      }));
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to update access policy', isLoading: false });
      throw err;
    }
  },

  verifyAccessReview: async (reviewId) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await iamService.verifyAccessReview(reviewId);
      set((state) => ({
        accessReviews: state.accessReviews.map(r => r.id === reviewId ? updated : r),
        isLoading: false
      }));
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to verify review', isLoading: false });
      throw err;
    }
  }
}));
