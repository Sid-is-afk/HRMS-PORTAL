import { useCallback } from 'react';
import { useTenantStore } from '../store/tenantStore';
import { tenantService } from '../services/tenantService';

export function useTenants() {
  const store = useTenantStore();

  const fetchDashboard = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const summary = await tenantService.getDashboardSummary();
      store.setDashboardSummary(summary);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch dashboard');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchTenants = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const tenants = await tenantService.getTenants();
      store.setTenants(tenants);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch tenants');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const getTenantDetails = async (id) => {
    try {
      store.setLoading(true);
      store.setError(null);
      const [tenant, events] = await Promise.all([
        tenantService.getTenantById(id),
        tenantService.getLifecycleTimeline(id)
      ]);
      store.setSelectedTenant(tenant);
      store.setLifecycleEvents(events);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch tenant details');
    } finally {
      store.setLoading(false);
    }
  };

  return { ...store, fetchDashboard, fetchTenants, getTenantDetails };
}
