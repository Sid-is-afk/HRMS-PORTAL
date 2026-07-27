import { useRbacStore } from '../store/rbacStore';
import { ROLES } from '../roles';

export function useAdminNavigation() {
  const role = useRbacStore((state) => state.role);
  const navigationTree = useRbacStore((state) => state.navigationTree);

  const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN || role === ROLES.HR;

  return {
    isAdmin,
    adminRoutes: isAdmin ? (navigationTree || []) : [],
  };
}
