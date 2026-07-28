import { useEffect } from 'react';
import { useOrganizationStore } from '../store/organizationStore';
import { useShallow } from 'zustand/react/shallow';

export function useDepartments(id = null) {
  const {
    departments,
    selectedDepartment,
    isLoading,
    error,
    deptFilters,
    setDeptFilters,
    loadDepartments,
    loadDepartment,
    loadMetadata,
    managers,
  } = useOrganizationStore(useShallow((state) => ({
    departments: state.departments,
    selectedDepartment: state.selectedDepartment,
    isLoading: state.isLoading,
    error: state.error,
    deptFilters: state.deptFilters,
    setDeptFilters: state.setDeptFilters,
    loadDepartments: state.loadDepartments,
    loadDepartment: state.loadDepartment,
    loadMetadata: state.loadMetadata,
    managers: state.managers,
  })));

  useEffect(() => {
    loadMetadata();
    if (id) {
      loadDepartment(id);
    } else {
      loadDepartments();
    }
  }, [id, loadDepartment, loadDepartments, loadMetadata]);

  return {
    departments,
    department: selectedDepartment,
    isLoading,
    error,
    filters: deptFilters,
    setFilters: setDeptFilters,
    managers,
  };
}
