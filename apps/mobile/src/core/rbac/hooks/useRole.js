import { useRbacStore } from '../store/rbacStore';

export function useRole() {
  const role = useRbacStore((state) => state.role);
  const isLoading = useRbacStore((state) => state.isLoading);
  return { role, isLoading };
}
