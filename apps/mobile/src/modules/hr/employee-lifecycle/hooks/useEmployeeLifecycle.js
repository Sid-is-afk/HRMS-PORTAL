import { useEffect } from 'react';
import { useLifecycleStore } from '../store/lifecycleStore';
import { lifecycleService } from '../services/lifecycleService';

export function useEmployeeLifecycle() {
  const { 
    conversions, onboardingTasks, probations, 
    isLoading, error, setLoading, setError,
    setConversions, setOnboardingTasks, setProbations 
  } = useLifecycleStore();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [convs, tasks, probs] = await Promise.all([
        lifecycleService.getPendingConversions(),
        lifecycleService.getOnboardingTasks(),
        lifecycleService.getActiveProbations()
      ]);
      setConversions(convs);
      setOnboardingTasks(tasks);
      setProbations(probs);
    } catch (err) {
      setError(err.message || 'Failed to fetch lifecycle data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { conversions, onboardingTasks, probations, isLoading, error, refresh: fetchData };
}
