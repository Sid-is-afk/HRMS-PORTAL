import { useCallback } from 'react';
import { useIdentityStore } from '../store/identityStore';
import { identityService } from '../services/identityService';

export function useIdentity() {
  const store = useIdentityStore();

  const fetchDashboard = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const summary = await identityService.getDashboardSummary();
      store.setDashboardSummary(summary);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch dashboard');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      store.setLoading(true);
      const users = await identityService.getPlatformUsers();
      store.setPlatformUsers(users);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch users');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      store.setLoading(true);
      const roles = await identityService.getGlobalRoles();
      store.setGlobalRoles(roles);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch roles');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      store.setLoading(true);
      const sessions = await identityService.getSessions();
      store.setSessions(sessions);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch sessions');
    } finally {
      store.setLoading(false);
    }
  }, []);

  return { 
    ...store, 
    fetchDashboard, 
    fetchUsers, 
    fetchRoles, 
    fetchSessions 
  };
}
