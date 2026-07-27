import { useEffect } from 'react';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { intelligenceService } from '../services/intelligenceService';

export function usePeopleIntelligence() {
  const store = useIntelligenceStore();

  const fetchData = async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const [kpis, workforce, insights] = await Promise.all([
        intelligenceService.getExecutiveDashboard(),
        intelligenceService.getWorkforceAnalytics(),
        intelligenceService.getInsights()
      ]);
      store.setExecutiveKpis(kpis);
      store.setWorkforceMetrics(workforce);
      store.setInsights(insights);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch analytics data');
    } finally {
      store.setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [store.filters]);

  return { ...store, refresh: fetchData };
}
