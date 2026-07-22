import { useAdminDashboardStore } from '../store/adminDashboardStore';

export function useDashboardSummary() {
  const { summary, attendanceSummary, leaveSummary, employeeSummary, systemHealth } = useAdminDashboardStore(
    (state) => ({
      summary: state.summary,
      attendanceSummary: state.attendanceSummary,
      leaveSummary: state.leaveSummary,
      employeeSummary: state.employeeSummary,
      systemHealth: state.systemHealth,
    })
  );

  return {
    summary,
    attendanceSummary,
    leaveSummary,
    employeeSummary,
    systemHealth,
  };
}
