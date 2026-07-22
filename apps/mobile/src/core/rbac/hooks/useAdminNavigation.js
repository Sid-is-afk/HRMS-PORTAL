import { useRbacStore } from '../store/rbacStore';
import { ROLES } from '../roles';

export function useAdminNavigation() {
  const { role, navigationTree } = useRbacStore((state) => ({
    role: state.role,
    navigationTree: state.navigationTree,
  }));

  const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN || role === ROLES.HR;

  return {
    isAdmin,
    adminRoutes: isAdmin ? (navigationTree || []) : [],
  };
}
