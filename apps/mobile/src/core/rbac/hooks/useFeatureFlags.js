import { useRbacStore } from '../store/rbacStore';

export function useFeatureFlags() {
  const featureFlags = useRbacStore((state) => state.featureFlags);

  const isEnabled = (flag) => {
    return !!featureFlags[flag];
  };

  return { featureFlags, isEnabled };
}
