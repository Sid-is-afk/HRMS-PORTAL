import { useLifecycleStore } from '../store/lifecycleStore';
import { lifecycleService } from '../services/lifecycleService';

export function useLifecycleActions() {
  const { addConversion, updateTaskStatus, setLoading, setError } = useLifecycleStore();

  const convertCandidate = async (data) => {
    try {
      setLoading(true);
      const newConversion = await lifecycleService.convertCandidate(data);
      addConversion(newConversion);
      return newConversion;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleOnboardingTask = async (taskId, isCompleted) => {
    try {
      await lifecycleService.updateTaskStatus(taskId, isCompleted);
      updateTaskStatus(taskId, isCompleted);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { convertCandidate, toggleOnboardingTask };
}
