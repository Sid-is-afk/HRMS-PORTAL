import { useEffect } from 'react';
import { useTalentStore } from '../store/talentStore';
import { talentService } from '../services/talentService';

export function useTalentDevelopment() {
  const { 
    goals, courses, complianceRecords, 
    isLoading, error, setLoading, setError,
    setGoals, setCourses, setComplianceRecords 
  } = useTalentStore();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [g, c, comp] = await Promise.all([
        talentService.getGoals(),
        talentService.getLearningCatalog(),
        talentService.getComplianceStatus()
      ]);
      setGoals(g);
      setCourses(c);
      setComplianceRecords(comp);
    } catch (err) {
      setError(err.message || 'Failed to fetch talent data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { goals, courses, complianceRecords, isLoading, error, refresh: fetchData };
}
