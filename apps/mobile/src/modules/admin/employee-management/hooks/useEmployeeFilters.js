import { useEmployeeManagementStore } from '../store/employeeManagementStore';
import { useShallow } from 'zustand/react/shallow';

export function useEmployeeFilters() {
  const {
    filters,
    setFilters,
    resetFilters,
    departments,
    designations,
    managers,
  } = useEmployeeManagementStore(useShallow((state) => ({
    filters: state.filters,
    setFilters: state.setFilters,
    resetFilters: state.resetFilters,
    departments: state.departments,
    designations: state.designations,
    managers: state.managers,
  })));

  return {
    filters,
    setFilters,
    reset: resetFilters,
    departments,
    designations,
    managers,
  };
}
