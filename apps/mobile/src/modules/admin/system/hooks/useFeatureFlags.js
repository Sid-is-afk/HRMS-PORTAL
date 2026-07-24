import { useEffect } from 'react';
import { useSystemStore } from '../store/systemStore';

export const useFeatureFlags = () => {
  const { featureFlags, isLoading, error, fetchFeatureFlags, toggleFeatureFlag } = useSystemStore();

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  return { featureFlags, isLoading, error, fetchFeatureFlags, toggleFeatureFlag };
};
