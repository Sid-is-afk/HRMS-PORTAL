import { useEffect } from 'react';
import { useSystemStore } from '../store/systemStore';

export const useSystemHealth = () => {
  const { healthMetrics, isLoading, error, fetchSystemHealth } = useSystemStore();

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  return { healthMetrics, isLoading, error, fetchSystemHealth };
};
