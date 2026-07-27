import { useAdminDashboardStore } from '../store/adminDashboardStore';

export function useDashboardWidgets() {
  const widgets = useAdminDashboardStore((state) => state.widgets);
  const toggleWidgetVisibility = useAdminDashboardStore((state) => state.toggleWidgetVisibility);
  const reorderWidgets = useAdminDashboardStore((state) => state.reorderWidgets);

  return {
    widgets,
    toggleWidgetVisibility,
    reorderWidgets,
  };
}
