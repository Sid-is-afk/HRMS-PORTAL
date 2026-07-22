import { useAdminDashboardStore } from '../store/adminDashboardStore';

export function useDashboardWidgets() {
  const { widgets, toggleWidgetVisibility, reorderWidgets } = useAdminDashboardStore(
    (state) => ({
      widgets: state.widgets,
      toggleWidgetVisibility: state.toggleWidgetVisibility,
      reorderWidgets: state.reorderWidgets,
    })
  );

  return {
    widgets,
    toggleWidgetVisibility,
    reorderWidgets,
  };
}
