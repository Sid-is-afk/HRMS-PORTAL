import { useCallback } from 'react';
import { useGovernanceStore } from '../store/governanceStore';
import { governanceService } from '../services/governanceService';

export function useGovernance() {
  const store = useGovernanceStore();

  const fetchDashboard = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const summary = await governanceService.getDashboardSummary();
      store.setDashboardSummary(summary);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch dashboard');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchFeatures = useCallback(async () => {
    try {
      store.setLoading(true);
      const features = await governanceService.getFeatures();
      store.setFeatures(features);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch features');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchModules = useCallback(async () => {
    try {
      store.setLoading(true);
      const modules = await governanceService.getModules();
      store.setModules(modules);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch modules');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    try {
      store.setLoading(true);
      const subs = await governanceService.getSubscriptions();
      store.setSubscriptions(subs);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch subscriptions');
    } finally {
      store.setLoading(false);
    }
  }, []);

  return { 
    ...store, 
    fetchDashboard, 
    fetchFeatures, 
    fetchModules, 
    fetchSubscriptions 
  };
}
