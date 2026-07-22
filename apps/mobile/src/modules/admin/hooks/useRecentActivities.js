import { useAdminDashboardStore } from '../store/adminDashboardStore';

export function useRecentActivities() {
  const recentActivities = useAdminDashboardStore((state) => state.recentActivities);

  return {
    recentActivities,
  };
}
