import { useEffect } from 'react';
import { usePlatformStore } from '../store/platformStore';
import { platformService } from '../services/platformService';

export function usePlatformDashboard() {
  const store = usePlatformStore();

  const fetchDashboard = async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const [summary, activities, notifications] = await Promise.all([
        platformService.getDashboardSummary(),
        platformService.getActivities(),
        platformService.getNotifications()
      ]);
      store.setDashboardSummary(summary);
      store.setActivities(activities);
      store.setNotifications(notifications);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch platform dashboard');
    } finally {
      store.setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { ...store, refresh: fetchDashboard };
}
