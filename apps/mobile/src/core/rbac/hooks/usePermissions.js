import { useRbacStore } from '../store/rbacStore';

export function usePermissions() {
  const permissions = useRbacStore((state) => state.permissions);
  return { permissions };
}
