import { create } from 'zustand';
import { useAuthStore } from '@/core/auth/authStore';
import { rbacService } from '../services/rbacService';

export const useRbacStore = create((set, get) => ({
  role: null,
  permissions: [],
  accessibleModules: [],
  featureFlags: {},
  navigationTree: null,
  isLoading: false,

  setRoleData: (role, permissions, accessibleModules, featureFlags, navigationTree) => {
    set({ role, permissions, accessibleModules, featureFlags, navigationTree });
  },

  setLoading: (isLoading) => set({ isLoading }),

  reset: () => {
    set({
      role: null,
      permissions: [],
      accessibleModules: [],
      featureFlags: {},
      navigationTree: null,
      isLoading: false,
    });
  },

  syncWithUser: (user) => {
    if (!user) {
      get().reset();
      return;
    }
    set({ isLoading: true });
    const role = user.role || 'EMPLOYEE';
    const permissions = rbacService.resolvePermissions(role);
    const accessibleModules = rbacService.resolveAccessibleModules(role);
    const featureFlags = rbacService.resolveFeatureFlags(role);
    const navigationTree = rbacService.resolveNavigation(role);
    set({
      role,
      permissions,
      accessibleModules,
      featureFlags,
      navigationTree,
      isLoading: false,
    });
  }
}));

// Subscribe to auth store changes to automatically keep RBAC store in sync
useAuthStore.subscribe((state) => {
  const user = state.user;
  const currentRbacRole = useRbacStore.getState().role;
  const userRole = user?.role || null;
  if (userRole !== currentRbacRole) {
    useRbacStore.getState().syncWithUser(user);
  }
});
