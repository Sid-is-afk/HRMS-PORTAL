import { useEmployeeManagementStore } from '../store/employeeManagementStore';

export function useEmployeeFilters() {
  const {
    filters,
    setFilters,
    resetFilters,
    departments,
    designations,
    managers,
  } = useEmployeeManagementStore((state) => ({
    filters: state.filters,
    setFilters: state.setFilters,
    resetFilters: state.resetFilters,
    departments: state.departments,
    designations: state.designations,
    managers: state.managers,
  }));

  return {
    filters,
    setFilters,
    reset: resetFilters,
    departments,
    designations,
    managers,
  };
}
