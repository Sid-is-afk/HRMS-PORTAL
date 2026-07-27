import { useCallback } from 'react';
import { useOperationsStore } from '../store/operationsStore';
import { operationsService } from '../services/operationsService';

export function useOperations() {
  const store = useOperationsStore();

  const fetchDashboard = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const summary = await operationsService.getDashboardSummary();
      store.setDashboardSummary(summary);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch dashboard');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      store.setLoading(true);
      const services = await operationsService.getServices();
      store.setServices(services);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch services');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchIncidents = useCallback(async () => {
    try {
      store.setLoading(true);
      const incidents = await operationsService.getIncidents();
      store.setIncidents(incidents);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch incidents');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      store.setLoading(true);
      const logs = await operationsService.getLogs();
      store.setLogs(logs);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch logs');
    } finally {
      store.setLoading(false);
    }
  }, []);

  return { 
    ...store, 
    fetchDashboard, 
    fetchServices, 
    fetchIncidents, 
    fetchLogs 
  };
}
