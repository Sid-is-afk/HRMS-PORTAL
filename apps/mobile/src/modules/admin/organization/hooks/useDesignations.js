import { useEffect } from 'react';
import { useOrganizationStore } from '../store/organizationStore';

export function useDesignations(id = null) {
  const {
    designations,
    selectedDesignation,
    isLoading,
    error,
    desigFilters,
    setDesigFilters,
    loadDesignations,
    loadDesignation,
    departments,
    loadDepartments,
  } = useOrganizationStore((state) => ({
    designations: state.designations,
    selectedDesignation: state.selectedDesignation,
    isLoading: state.isLoading,
    error: state.error,
    desigFilters: state.desigFilters,
    setDesigFilters: state.setDesigFilters,
    loadDesignations: state.loadDesignations,
    loadDesignation: state.loadDesignation,
    departments: state.departments,
    loadDepartments: state.loadDepartments,
  }));

  useEffect(() => {
    loadDepartments();
    if (id) {
      loadDesignation(id);
    } else {
      loadDesignations();
    }
  }, [id, loadDesignation, loadDesignations, loadDepartments]);

  return {
    designations,
    designation: selectedDesignation,
    isLoading,
    error,
    filters: desigFilters,
    setFilters: setDesigFilters,
    departments,
  };
}
