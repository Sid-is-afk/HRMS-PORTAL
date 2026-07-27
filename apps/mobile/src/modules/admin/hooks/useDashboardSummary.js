import { useAdminDashboardStore } from '../store/adminDashboardStore';

export function useDashboardSummary() {
  const summary = useAdminDashboardStore((state) => state.summary);
  const attendanceSummary = useAdminDashboardStore((state) => state.attendanceSummary);
  const leaveSummary = useAdminDashboardStore((state) => state.leaveSummary);
  const employeeSummary = useAdminDashboardStore((state) => state.employeeSummary);
  const systemHealth = useAdminDashboardStore((state) => state.systemHealth);

  return {
    summary,
    attendanceSummary,
    leaveSummary,
    employeeSummary,
    systemHealth,
  };
}
