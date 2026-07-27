import { useCallback } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { analyticsService } from '../services/analyticsService';

export function useAnalytics() {
  const store = useAnalyticsStore();

  const fetchExecutiveSummary = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const summary = await analyticsService.getExecutiveSummary();
      store.setExecutiveSummary(summary);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch summary');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchTrendMetrics = useCallback(async () => {
    try {
      store.setLoading(true);
      const trends = await analyticsService.getTrendMetrics();
      store.setTrendMetrics(trends);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch trends');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchUsageMetrics = useCallback(async () => {
    try {
      store.setLoading(true);
      const usage = await analyticsService.getUsageMetrics();
      store.setUsageMetrics(usage);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch usage metrics');
    } finally {
      store.setLoading(false);
    }
  }, []);

  return { 
    ...store, 
    fetchExecutiveSummary, 
    fetchTrendMetrics, 
    fetchUsageMetrics 
  };
}
